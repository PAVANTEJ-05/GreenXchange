// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import "./GreenCreditToken.sol";

contract GreenXchangeOrderbook is
    Initializable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable,
    ReentrancyGuardUpgradeable,
    IERC1155ReceiverUpgradeable
{
    using SafeERC20 for IERC20;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    struct Order {
        uint256 orderId;
        address maker;
        uint256 tokenId;
        bool isBuy; // true = buy (maker locks PYUSD), false = sell (maker locks credits)
        uint256 price; // price per credit in PYUSD smallest unit
        uint256 amount; // total credits
        uint256 filled; // filled amount
        uint256 timestamp;
        uint256 expiration; // 0 = no expiration
        uint256 minAmountOut; // slippage tolerance
        address referrer; // optional fee recipient
    }

    GreenCreditToken public credits;
    IERC20 public pyusd;
    uint8 public pyusdDecimals;

    uint256 public platformFeeBps;
    address public platformFeeRecipient;
    uint256 public constant BPS_DENOM = 10000;

    uint256 public nextOrderId;
    mapping(uint256 => Order) public orders;
    mapping(uint256 => bool) public orderActive;

    // escrow bookkeeping
    mapping(uint256 => uint256) public escrowedPYUSDByOrder;
    mapping(uint256 => uint256) public escrowedCreditsByOrder;

    // price levels / order book indices (naive arrays for prototype)
    mapping(uint256 => uint256[]) public activePricesPerToken; // tokenId => prices
    mapping(uint256 => mapping(uint256 => uint256[])) public ordersAtPrice; // tokenId => price => orderIds

    // per-user escrow tracking
    mapping(address => uint256) public pyusdEscrowed;
    mapping(address => mapping(uint256 => uint256)) public creditsEscrowed; // user => tokenId => amount

    // Sepolia PYUSD default (if initializer passed address(0))
    address public constant SEPOLIA_PYUSD = 0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9;

    // Events
    event OrderPlaced(
        uint256 indexed orderId,
        address indexed maker,
        uint256 tokenId,
        bool isBuy,
        uint256 price,
        uint256 amount,
        uint256 expiration,
        address referrer
    );
    event OrderCancelled(uint256 indexed orderId, address indexed maker);
    event OrderMatched(
        uint256 indexed orderIdMaker,
        uint256 indexed orderIdTaker,
        address maker,
        address taker,
        uint256 tokenId,
        uint256 price,
        uint256 amount,
        uint256 platformFee,
        uint256 referrerFee
    );
    event PYUSDEscrowed(uint256 indexed orderId, address indexed maker, uint256 amount);
    event CreditsEscrowed(uint256 indexed orderId, address indexed maker, uint256 tokenId, uint256 amount);
    event PYUSDWithdrawn(address indexed to, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the Orderbook
    /// @param admin admin address (granted DEFAULT_ADMIN, MANAGER, UPGRADER)
    /// @param creditsAddress address of deployed GreenCreditToken (ERC1155)
    /// @param pyusdAddress address of PYUSD ERC20 (pass address(0) to default to Sepolia testnet PYUSD)
    /// @param _pyusdDecimals decimals for PYUSD (e.g., 6)
    /// @param feeRecipient platform fee recipient
    /// @param feeBps platform fee in bps (e.g., 100 = 1%)
    function initialize(
        address admin,
        address payable creditsAddress,
        address pyusdAddress,
        uint8 _pyusdDecimals,
        address feeRecipient,
        uint256 feeBps
    ) public initializer {
    __AccessControl_init();
    __Pausable_init();
    __UUPSUpgradeable_init();
    __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MANAGER_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);

        require(creditsAddress != address(0), "credits addr 0");
       credits = GreenCreditToken(payable(creditsAddress));



        if (pyusdAddress == address(0)) pyusdAddress = SEPOLIA_PYUSD;
        pyusd = IERC20(pyusdAddress);
        pyusdDecimals = _pyusdDecimals;

        platformFeeRecipient = feeRecipient;
        platformFeeBps = feeBps;

        nextOrderId = 1;
    }

    function _authorizeUpgrade(address) internal override onlyRole(UPGRADER_ROLE) {}

    // -------------------------
    // Admin
    // -------------------------
    function setPlatformFee(uint256 bps) external onlyRole(MANAGER_ROLE) {
        require(bps <= 2000, "Fee too high");
        platformFeeBps = bps;
    }

    function setPlatformFeeRecipient(address recipient) external onlyRole(MANAGER_ROLE) {
        require(recipient != address(0), "zero recipient");
        platformFeeRecipient = recipient;
    }

    function setPYUSD(address tokenAddr, uint8 decimals_) external onlyRole(MANAGER_ROLE) {
        require(tokenAddr != address(0), "zero addr");
        pyusd = IERC20(tokenAddr);
        pyusdDecimals = decimals_;
    }

    /// @notice Withdraw accumulated PYUSD from the contract (fees etc.)
    function withdrawPYUSD(address to, uint256 amount) external onlyRole(MANAGER_ROLE) {
        require(to != address(0), "zero to");
        uint256 bal = pyusd.balanceOf(address(this));
        require(amount <= bal, "insufficient balance");
        pyusd.safeTransfer(to, amount);
        emit PYUSDWithdrawn(to, amount);
    }

    // -------------------------
    // Place Orders
    // -------------------------
    /// @notice Place a limit order (buy or sell)
    /// - For sell orders, the user must have approved this contract (setApprovalForAll)
    function placeOrder(
        uint256 tokenId,
        bool isBuy,
        uint256 price,
        uint256 amount,
        uint256 expiration,
        uint256 minAmountOut,
        address referrer
    ) external whenNotPaused nonReentrant {
        require(amount > 0, "amount>0");
        require(price > 0, "price>0");

        if (!isBuy) {
            // require user owns credits and has approved this contract
            require(credits.balanceOf(msg.sender, tokenId) >= amount, "insufficient credits");
            require(credits.isApprovedForAll(msg.sender, address(this)), "approve orderbook");
        }

        uint256 orderId = nextOrderId++;
        Order storage o = orders[orderId];
        o.orderId = orderId;
        o.maker = msg.sender;
        o.tokenId = tokenId;
        o.isBuy = isBuy;
        o.price = price;
        o.amount = amount;
        o.filled = 0;
        o.timestamp = block.timestamp;
        o.expiration = expiration;
        o.minAmountOut = minAmountOut;
        o.referrer = referrer;

        orderActive[orderId] = true;

        if (isBuy) {
            uint256 cost = _mulSafe(price, amount);
            // pull PYUSD from maker
            pyusd.safeTransferFrom(msg.sender, address(this), cost);
            escrowedPYUSDByOrder[orderId] = cost;
            pyusdEscrowed[msg.sender] += cost;
            emit PYUSDEscrowed(orderId, msg.sender, cost);
        } else {
            // transfer credits to this contract (escrow)
            credits.safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
            escrowedCreditsByOrder[orderId] = amount;
            creditsEscrowed[msg.sender][tokenId] += amount;
            emit CreditsEscrowed(orderId, msg.sender, tokenId, amount);
        }

        // add to price level
        if (!_priceExists(tokenId, price)) {
            activePricesPerToken[tokenId].push(price);
        }
        ordersAtPrice[tokenId][price].push(orderId);

        emit OrderPlaced(orderId, msg.sender, tokenId, isBuy, price, amount, expiration, referrer);
    }
function supportsInterface(bytes4 interfaceId)
    public
    view
    override(AccessControlUpgradeable, IERC165Upgradeable)
    returns (bool)
{
    return super.supportsInterface(interfaceId);
}


    // -------------------------
    // Cancel Orders
    // -------------------------
    function cancelOrder(uint256 orderId) external nonReentrant {
        require(orderActive[orderId], "not active");
        Order storage o = orders[orderId];
        require(msg.sender == o.maker || hasRole(MANAGER_ROLE, msg.sender), "not allowed");
        require(o.filled < o.amount, "already filled");

        orderActive[orderId] = false;

        if (o.isBuy) {
            uint256 locked = escrowedPYUSDByOrder[orderId];
            if (locked > 0) {
                escrowedPYUSDByOrder[orderId] = 0;
                pyusdEscrowed[o.maker] -= locked;
                pyusd.safeTransfer(o.maker, locked);
            }
        } else {
            uint256 locked = escrowedCreditsByOrder[orderId];
            if (locked > 0) {
                escrowedCreditsByOrder[orderId] = 0;
                creditsEscrowed[o.maker][o.tokenId] -= locked;
                // send credits back to maker
                credits.safeTransferFrom(address(this), o.maker, o.tokenId, locked, "");
            }
        }

        // remove from ordersAtPrice (cleanup)
        _removeOrderFromBook(o.tokenId, o.price, orderId);

        emit OrderCancelled(orderId, o.maker);
    }

    // -------------------------
    // Fill Orders (taker fills maker's order)
    // -------------------------
    function fillOrder(uint256 orderId, uint256 fillAmount) external whenNotPaused nonReentrant {
        require(orderActive[orderId], "not active");
        require(fillAmount > 0, "fill>0");
        Order storage makerOrder = orders[orderId];
        require(makerOrder.expiration == 0 || block.timestamp <= makerOrder.expiration, "expired");
        uint256 remaining = makerOrder.amount - makerOrder.filled;
        require(remaining >= fillAmount, "fill > remaining");

        if (makerOrder.isBuy) {
            // maker wants to buy credits -> taker sells credits
            _executeMatchSell(makerOrder, orderId, fillAmount);
        } else {
            // maker wants to sell credits -> taker buys (must pay PYUSD)
            _executeMatchBuy(makerOrder, orderId, fillAmount);
        }

        // if fully filled, cleanup order from book
        if (makerOrder.filled >= makerOrder.amount) {
            orderActive[orderId] = false;
            _removeOrderFromBook(makerOrder.tokenId, makerOrder.price, orderId);
        }
    }

    // maker.isBuy == true -> maker locked PYUSD; taker sells credits
    function _executeMatchSell(Order storage makerOrder, uint256 makerOrderId, uint256 fillAmount) internal {
        uint256 tokenId = makerOrder.tokenId;

        // taker (msg.sender) must transfer credits to maker
        credits.safeTransferFrom(msg.sender, makerOrder.maker, tokenId, fillAmount, "");

        // settle PYUSD from escrowed maker funds
        uint256 tradeValue = _mulSafe(makerOrder.price, fillAmount);
        uint256 platformFee = (tradeValue * platformFeeBps) / BPS_DENOM;
        uint256 referrerFee = 0;
        if (makerOrder.referrer != address(0) && platformFee > 0) {
            // give 10% of platform fee to referrer (example split)
            referrerFee = (platformFee * 10) / 100;
            platformFee -= referrerFee;
            pyusd.safeTransfer(makerOrder.referrer, referrerFee);
        }

        uint256 netToTaker = tradeValue - platformFee - referrerFee;

        // bookkeeping
        escrowedPYUSDByOrder[makerOrderId] -= tradeValue;
        pyusdEscrowed[makerOrder.maker] -= tradeValue;

        // pay taker and platform
        pyusd.safeTransfer(msg.sender, netToTaker);
        if (platformFee > 0) pyusd.safeTransfer(platformFeeRecipient, platformFee);

        // mark filled
        makerOrder.filled += fillAmount;

        emit OrderMatched(makerOrderId, 0, makerOrder.maker, msg.sender, tokenId, makerOrder.price, fillAmount, platformFee, referrerFee);
    }

    // maker.isBuy == false -> maker locked credits; taker buys with PYUSD
    function _executeMatchBuy(Order storage makerOrder, uint256 makerOrderId, uint256 fillAmount) internal {
        uint256 tokenId = makerOrder.tokenId;

        uint256 tradeValue = _mulSafe(makerOrder.price, fillAmount);

        // taker must send PYUSD to contract
        pyusd.safeTransferFrom(msg.sender, address(this), tradeValue);

        uint256 platformFee = (tradeValue * platformFeeBps) / BPS_DENOM;
        uint256 referrerFee = 0;
        if (makerOrder.referrer != address(0) && platformFee > 0) {
            referrerFee = (platformFee * 10) / 100;
            platformFee -= referrerFee;
            pyusd.safeTransfer(makerOrder.referrer, referrerFee);
        }

        uint256 netToMaker = tradeValue - platformFee - referrerFee;

        // transfer credits from escrow to taker
        escrowedCreditsByOrder[makerOrderId] -= fillAmount;
        creditsEscrowed[makerOrder.maker][tokenId] -= fillAmount;
        credits.safeTransferFrom(address(this), msg.sender, tokenId, fillAmount, "");

        // transfer PYUSD to maker and platform
        pyusd.safeTransfer(makerOrder.maker, netToMaker);
        if (platformFee > 0) pyusd.safeTransfer(platformFeeRecipient, platformFee);

        makerOrder.filled += fillAmount;

        emit OrderMatched(makerOrderId, 0, makerOrder.maker, msg.sender, tokenId, makerOrder.price, fillAmount, platformFee, referrerFee);
    }

    // -------------------------
    // Internal helpers
    // -------------------------
    function _mulSafe(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0 || b == 0) return 0;
        require(a <= type(uint256).max / b, "mul overflow");
        return a * b;
    }

    function _priceExists(uint256 tokenId, uint256 price) internal view returns (bool) {
        uint256[] storage arr = activePricesPerToken[tokenId];
        for (uint256 i = 0; i < arr.length; ++i) {
            if (arr[i] == price) return true;
        }
        return false;
    }

    function _removeOrderFromBook(uint256 tokenId, uint256 price, uint256 orderId) internal {
        uint256[] storage arr = ordersAtPrice[tokenId][price];
        for (uint256 i = 0; i < arr.length; ++i) {
            if (arr[i] == orderId) {
                arr[i] = arr[arr.length - 1];
                arr.pop();
                break;
            }
        }
        // if no orders left at this price, remove the price level
        if (arr.length == 0) {
            uint256[] storage prices = activePricesPerToken[tokenId];
            for (uint256 i = 0; i < prices.length; ++i) {
                if (prices[i] == price) {
                    prices[i] = prices[prices.length - 1];
                    prices.pop();
                    break;
                }
            }
        }
    }

    // -------------------------
    // Pause / Unpause
    // -------------------------
    function pause() external onlyRole(MANAGER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(MANAGER_ROLE) {
        _unpause();
    }

    // -------------------------
    // ERC1155 Receiver
    // -------------------------
    function onERC1155Received(address, address, uint256, uint256, bytes calldata) external pure override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata) external pure override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    // gap for upgrade safety
    uint256[50] private __gap;
}