// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./GreenCreditToken.sol";

contract GreenXchangeOrderbook is
    AccessControl,
    Pausable,
    ReentrancyGuard,
    IERC1155Receiver
{
    using SafeERC20 for IERC20;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

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

    uint256 public nextOrderId;
    mapping(uint256 => Order) public orders;
    mapping(uint256 => bool) public orderActive;

    // escrow bookkeeping
    mapping(uint256 => uint256) public escrowedPYUSDByOrder;
    mapping(uint256 => uint256) public escrowedCreditsByOrder;

    // price levels / order book indices
    mapping(uint256 => uint256[]) public activePricesPerToken; // tokenId => prices
    mapping(uint256 => mapping(uint256 => uint256[])) public ordersAtPrice; // tokenId => price => orderIds

    // per-user escrow tracking
    mapping(address => uint256) public pyusdEscrowed;
    mapping(address => mapping(uint256 => uint256)) public creditsEscrowed; // user => tokenId => amount

    // Sepolia PYUSD default (if address(0))
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
        uint256 amount
    );
    event PYUSDEscrowed(uint256 indexed orderId, address indexed maker, uint256 amount);
    event CreditsEscrowed(uint256 indexed orderId, address indexed maker, uint256 tokenId, uint256 amount);
    event PYUSDWithdrawn(address indexed to, uint256 amount);

    /// @notice Deploy constructor with all initializations
    constructor(
        address admin,
        address creditsAddress,
        address pyusdAddress,
        uint8 _pyusdDecimals
    ) {
        require(admin != address(0), "zero admin");
        require(creditsAddress != address(0), "zero credits");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MANAGER_ROLE, admin);

        credits = GreenCreditToken(payable(creditsAddress));

        if (pyusdAddress == address(0)) pyusdAddress = SEPOLIA_PYUSD;
        pyusd = IERC20(pyusdAddress);
        pyusdDecimals = _pyusdDecimals;

        nextOrderId = 1;
    }

    // -------------------------
    // Admin
    // -------------------------
    function setPYUSD(address tokenAddr, uint8 decimals_) external onlyRole(MANAGER_ROLE) {
        require(tokenAddr != address(0), "zero addr");
        pyusd = IERC20(tokenAddr);
        pyusdDecimals = decimals_;
    }

    /// @notice Withdraw accumulated PYUSD from the contract
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
            pyusd.safeTransferFrom(msg.sender, address(this), cost);
            escrowedPYUSDByOrder[orderId] = cost;
            pyusdEscrowed[msg.sender] += cost;
            emit PYUSDEscrowed(orderId, msg.sender, cost);
        } else {
            credits.safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
            escrowedCreditsByOrder[orderId] = amount;
            creditsEscrowed[msg.sender][tokenId] += amount;
            emit CreditsEscrowed(orderId, msg.sender, tokenId, amount);
        }

        if (!_priceExists(tokenId, price)) {
            activePricesPerToken[tokenId].push(price);
        }
        ordersAtPrice[tokenId][price].push(orderId);

        emit OrderPlaced(orderId, msg.sender, tokenId, isBuy, price, amount, expiration, referrer);
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
                credits.safeTransferFrom(address(this), o.maker, o.tokenId, locked, "");
            }
        }

        _removeOrderFromBook(o.tokenId, o.price, orderId);

        emit OrderCancelled(orderId, o.maker);
    }

    // -------------------------
    // Fill Orders
    // -------------------------
    function fillOrder(uint256 orderId, uint256 fillAmount) external whenNotPaused nonReentrant {
        require(orderActive[orderId], "not active");
        require(fillAmount > 0, "fill>0");
        Order storage makerOrder = orders[orderId];
        require(makerOrder.expiration == 0 || block.timestamp <= makerOrder.expiration, "expired");
        uint256 remaining = makerOrder.amount - makerOrder.filled;
        require(remaining >= fillAmount, "fill > remaining");

        if (makerOrder.isBuy) {
            _executeMatchSell(makerOrder, orderId, fillAmount);
        } else {
            _executeMatchBuy(makerOrder, orderId, fillAmount);
        }

        if (makerOrder.filled >= makerOrder.amount) {
            orderActive[orderId] = false;
            _removeOrderFromBook(makerOrder.tokenId, makerOrder.price, orderId);
        }
    }

    function _executeMatchSell(Order storage makerOrder, uint256 makerOrderId, uint256 fillAmount) internal {
        uint256 tokenId = makerOrder.tokenId;

        credits.safeTransferFrom(msg.sender, makerOrder.maker, tokenId, fillAmount, "");

        uint256 tradeValue = _mulSafe(makerOrder.price, fillAmount);

        escrowedPYUSDByOrder[makerOrderId] -= tradeValue;
        pyusdEscrowed[makerOrder.maker] -= tradeValue;

        pyusd.safeTransfer(msg.sender, tradeValue);

        makerOrder.filled += fillAmount;

        emit OrderMatched(makerOrderId, 0, makerOrder.maker, msg.sender, tokenId, makerOrder.price, fillAmount);
    }

    function _executeMatchBuy(Order storage makerOrder, uint256 makerOrderId, uint256 fillAmount) internal {
        uint256 tokenId = makerOrder.tokenId;

        uint256 tradeValue = _mulSafe(makerOrder.price, fillAmount);

        pyusd.safeTransferFrom(msg.sender, makerOrder.maker, tradeValue);

        escrowedCreditsByOrder[makerOrderId] -= fillAmount;
        creditsEscrowed[makerOrder.maker][tokenId] -= fillAmount;
        credits.safeTransferFrom(address(this), msg.sender, tokenId, fillAmount, "");

        makerOrder.filled += fillAmount;

        emit OrderMatched(makerOrderId, 0, makerOrder.maker, msg.sender, tokenId, makerOrder.price, fillAmount);
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

    // -------------------------
}
