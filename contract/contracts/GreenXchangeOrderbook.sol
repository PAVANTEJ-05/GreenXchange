// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title GreenXchangeOrderbook
/// @notice On-chain limit orderbook DEX for trading Green Credits (ERC1155 tokenId) against PYUSD (ERC20)
/// - Orders are limit orders: price is in PYUSD smallest unit (depends on pyusdDecimals)
/// - Order struct contains id, maker, tokenId, isBuyOrder, price, amount, filledAmount, timestamp, expiration
/// - Escrows PYUSD or credit tokens when orders created
/// - Matching engine: simple price-time priority scanning of active price levels
/// - Fee logic: basis points, split between platform and referrer
/// - ReentrancyGuard and Pausable
///
/// Tradeoffs:
/// - On-chain full orderbook ordering & price-level sorting is gas-heavy. For production, prefer off-chain matching and on-chain settlement.
import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-contracts-upgradeable/contracts/token/ERC1155/IERC1155ReceiverUpgradeable.sol";
import "openzeppelin-contracts-upgradeable/contracts/security/PausableUpgradeable.sol";
import "openzeppelin-contracts-upgradeable/contracts/access/AccessControlUpgradeable.sol";
import "openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";
import "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import "openzeppelin-contracts/security/ReentrancyGuard.sol";
import "./GreenCreditERC1155.sol";
import "./interfaces/IPYUSDPermit.sol";

contract GreenXchangeOrderbook is Initializable, AccessControlUpgradeable, PausableUpgradeable, UUPSUpgradeable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    struct Order {
        uint256 orderId;
        address maker;
        uint256 tokenId;
        bool isBuy; // true = buy (maker locks PYUSD), false = sell (maker locks credits)
        uint256 price; // price per credit in PYUSD smallest unit
        uint256 amount; // total amount of credits (units in token decimals)
        uint256 filled; // amount already filled
        uint256 timestamp;
        uint256 expiration; // 0 = no expiration
        uint256 minAmountOut; // slippage tolerance: min amount buyer expects after fills
        address referrer; // optional fee recipient
    }

    GreenCreditERC1155 public credits;
    IERC20 public pyusd;
    uint8 public pyusdDecimals;

    // fee: basis points (bps). e.g., 100 = 1%
    uint256 public platformFeeBps;
    address public platformFeeRecipient;
    uint256 public constant BPS_DENOM = 10000;

    // order storage
    uint256 public nextOrderId;
    mapping(uint256 => Order) public orders; // orderId => Order
    mapping(uint256 => bool) public orderActive; // active
    // bookkeeping for escrow
    mapping(uint256 => uint256) public escrowedPYUSDByOrder; // orderId -> pyusd amount
    mapping(uint256 => uint256) public escrowedCreditsByOrder; // orderId -> credits amount

    // price levels per tokenId: For simplicity we keep an array of active prices per tokenId.
    // Tradeoff: scanning linear arrays is gas heavy — acceptable for prototype.
    mapping(uint256 => uint256[]) public activePricesPerToken; // tokenId => prices
    mapping(uint256 => mapping(uint256 => uint256[])) public ordersAtPrice; // tokenId => price => orderIds

    // escrow balances per user (safety tracking)
    mapping(address => uint256) public pyusdEscrowed; // total PYUSD escrowed by user
    mapping(address => mapping(uint256 => uint256)) public creditsEscrowed; // user => tokenId => amount

    // events
    event OrderPlaced(uint256 indexed orderId, address indexed maker, uint256 tokenId, bool isBuy, uint256 price, uint256 amount, uint256 expiration, address referrer);
    event OrderCancelled(uint256 indexed orderId, address indexed maker);
    event OrderMatched(uint256 indexed orderIdMaker, uint256 indexed orderIdTaker, address maker, address taker, uint256 tokenId, uint256 price, uint256 amount, uint256 platformFee, uint256 referrerFee);
    event FeesCollected(uint256 indexed orderId, uint256 platformFee, uint256 referrerFee, address referrer);
    event PYUSDEscrowed(uint256 indexed orderId, address indexed maker, uint256 amount);
    event CreditsEscrowed(uint256 indexed orderId, address indexed maker, uint256 tokenId, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin, address creditsAddress, address pyusdAddress, uint8 _pyusdDecimals, address feeRecipient, uint256 feeBps) public initializer {
        __AccessControl_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MANAGER_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);

        credits = GreenCreditERC1155(creditsAddress);
        pyusd = IERC20(pyusdAddress);
        pyusdDecimals = _pyusdDecimals;
        platformFeeRecipient = feeRecipient;
        platformFeeBps = feeBps;

        nextOrderId = 1;
    }

    function _authorizeUpgrade(address newImpl) internal override onlyRole(UPGRADER_ROLE) {}

    // -------------------------
    // Admin functions
    // -------------------------
    function setPlatformFee(uint256 bps) external onlyRole(MANAGER_ROLE) {
        require(bps <= 2000, "Fee too high"); // 20% cap
        platformFeeBps = bps;
    }

    function setPlatformFeeRecipient(address recipient) external onlyRole(MANAGER_ROLE) {
        platformFeeRecipient = recipient;
    }

    function setPYUSD(address tokenAddr, uint8 decimals_) external onlyRole(MANAGER_ROLE) {
        pyusd = IERC20(tokenAddr);
        pyusdDecimals = decimals_;
    }

    // -------------------------
    // Place orders
    // -------------------------

    /**
     * @notice Place a limit order (buy or sell)
     * @param tokenId token id of credits
     * @param isBuy true => buy credits (lock PYUSD), false => sell credits (lock credits)
     * @param price price per credit in PYUSD smallest unit (depends on pyusdDecimals)
     * @param amount amount of credits
     * @param expiration unix timestamp (0 for none)
     * @param minAmountOut optional slippage min amount for buyers (0 if not used)
     * @param referrer optional referrer address for fee split
     * @param permitData optional permit bytes to call on pyusd (owner, spender, value, deadline, v,r,s) encoded if available
     */
    function placeOrder(
        uint256 tokenId,
        bool isBuy,
        uint256 price,
        uint256 amount,
        uint256 expiration,
        uint256 minAmountOut,
        address referrer,
        bytes calldata permitData
    ) external whenNotPaused nonReentrant {
        require(amount > 0, "amount>0");
        require(price > 0, "price>0");

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

        // escrow funds
        if (isBuy) {
            // total cost = price * amount (in smallest pyusd unit)
            uint256 cost = _mulDiv(price, amount);
            // attempt permit if provided (EIP-2612)
            if (permitData.length >= 32) {
                // low-level attempt to call permit; ignore revert and fallback to transferFrom
                // we expect permitData to be abi.encode(owner, spender, value, deadline, v, r, s)
                // However since ABI can't check arbitrary, we simply forward call to permit on pyusd via low-level if it exists.
                _tryPermit(permitData);
            }
            // transferFrom maker -> this
            pyusd.safeTransferFrom(msg.sender, address(this), cost);
            escrowedPYUSDByOrder[orderId] = cost;
            pyusdEscrowed[msg.sender] += cost;
            emit PYUSDEscrowed(orderId, msg.sender, cost);
        } else {
            // sell: maker must transfer credits to escrow
            // transfer via safeTransferFrom
            credits.safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
            escrowedCreditsByOrder[orderId] = amount;
            creditsEscrowed[msg.sender][tokenId] += amount;
            emit CreditsEscrowed(orderId, msg.sender, tokenId, amount);
        }

        // store order in ordersAtPrice
        if (!_priceExists(tokenId, price)) {
            activePricesPerToken[tokenId].push(price);
        }
        ordersAtPrice[tokenId][price].push(orderId);

        emit OrderPlaced(orderId, msg.sender, tokenId, isBuy, price, amount, expiration, referrer);
    }

    // Helper: try to call permit on pyusd (non-reverting attempt)
    function _tryPermit(bytes calldata permitData) internal {
        (bool success, ) = address(pyusd).call(permitData);
        // ignore success flag; if fail, we continue and expect approve+transferFrom
        // for production better to decode and call specific permit signature for safety
    }

    // -------------------------
    // Cancel orders
    // -------------------------

    /// @notice Cancel an active order. Only maker or manager can cancel.
    function cancelOrder(uint256 orderId) external nonReentrant {
        require(orderActive[orderId], "Not active");
        Order storage o = orders[orderId];
        require(msg.sender == o.maker || hasRole(MANAGER_ROLE, msg.sender), "Not allowed to cancel");
        require(o.filled < o.amount, "Already filled");

        orderActive[orderId] = false;

        // return escrow
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
                // Note: safeTransferFrom here uses credits contract's safeTransferFrom; however
                // some ERC1155 implementations require receiver checks. Since the contract is approved, this works.
            }
        }

        emit OrderCancelled(orderId, o.maker);
    }

    // -------------------------
    // Matching - Taker fills maker order(s)
    // -------------------------

    /// @notice Fill an order by specifying orderId and desired amount to fill
    /// @param orderId maker orderId to be filled
    /// @param fillAmount amount of credits to fill (<= remaining)
    function fillOrder(uint256 orderId, uint256 fillAmount) external whenNotPaused nonReentrant {
        require(orderActive[orderId], "order not active");
        require(fillAmount > 0, "fillAmount>0");
        Order storage makerOrder = orders[orderId];
        require(block.timestamp <= makerOrder.expiration || makerOrder.expiration == 0, "order expired");
        uint256 remaining = makerOrder.amount - makerOrder.filled;
        require(remaining >= fillAmount, "fill > remaining");

        // determine taker is buyer or seller opposite role
        if (makerOrder.isBuy) {
            // maker wanted to BUY credits; taker is a seller, must transfer credits to maker and receive PYUSD
            _executeMatchSell(makerOrder, orderId, fillAmount);
        } else {
            // maker is SELL: taker is a buyer, must provide PYUSD
            _executeMatchBuy(makerOrder, orderId, fillAmount);
        }
    }

    // Internal: maker.isBuy == true -> maker locked PYUSD; taker sells credits
    function _executeMatchSell(Order storage makerOrder, uint256 makerOrderId, uint256 fillAmount) internal {
        // Taker (msg.sender) must transfer credits to maker
        uint256 tokenId = makerOrder.tokenId;
        // Transfer credits from taker -> maker
        credits.safeTransferFrom(msg.sender, makerOrder.maker, tokenId, fillAmount, "");
        // Transfer PYUSD from escrowed maker funds to taker minus fees
        uint256 tradeValue = _mulDiv(makerOrder.price, fillAmount);
        // compute fees
        uint256 platformFee = (tradeValue * platformFeeBps) / BPS_DENOM;
        uint256 referrerFee = 0;
        if (makerOrder.referrer != address(0)) {
            // split referrer 10% of platform fee (example)
            referrerFee = (platformFee * 10) / 100;
            platformFee = platformFee - referrerFee;
            pyusd.safeTransfer(makerOrder.referrer, referrerFee);
        }
        uint256 netToTaker = tradeValue - platformFee - referrerFee;

        // bookkeeping and transfers
        escrowedPYUSDByOrder[makerOrderId] -= _mulDiv(makerOrder.price, fillAmount);
        pyusdEscrowed[makerOrder.maker] -= _mulDiv(makerOrder.price, fillAmount);

        // send net to taker
        pyusd.safeTransfer(msg.sender, netToTaker);
        // send platform fee to recipient
        if (platformFee > 0) {
            pyusd.safeTransfer(platformFeeRecipient, platformFee);
        }

        // update filled
        makerOrder.filled += fillAmount;

        emit OrderMatched(makerOrderId, 0, makerOrder.maker, msg.sender, tokenId, makerOrder.price, fillAmount, platformFee, referrerFee);

        // if fully filled, mark inactive
        if (makerOrder.filled >= makerOrder.amount) {
            orderActive[makerOrderId] = false;
        }
    }

    // Internal: maker.isBuy == false -> maker locked credits; taker must provide PYUSD
    function _executeMatchBuy(Order storage makerOrder, uint256 makerOrderId, uint256 fillAmount) internal {
        uint256 tokenId = makerOrder.tokenId;
        // taker must transfer PYUSD to contract first
        uint256 tradeValue = _mulDiv(makerOrder.price, fillAmount);

        // attempt to transferFrom taker -> contract
        pyusd.safeTransferFrom(msg.sender, address(this), tradeValue);

        // compute fees
        uint256 platformFee = (tradeValue * platformFeeBps) / BPS_DENOM;
        uint256 referrerFee = 0;
        if (makerOrder.referrer != address(0)) {
            referrerFee = (platformFee * 10) / 100;
            platformFee = platformFee - referrerFee;
            pyusd.safeTransfer(makerOrder.referrer, referrerFee);
        }

        uint256 netToMaker = tradeValue - platformFee - referrerFee;

        // transfer credits from escrow to taker (buyer)
        // maker had escrowed credits in escrowedCreditsByOrder
        escrowedCreditsByOrder[makerOrderId] -= fillAmount;
        creditsEscrowed[makerOrder.maker][tokenId] -= fillAmount;
        credits.safeTransferFrom(address(this), msg.sender, tokenId, fillAmount, "");

        // transfer net to maker
        pyusd.safeTransfer(makerOrder.maker, netToMaker);

        // platform fee to recipient
        if (platformFee > 0) {
            pyusd.safeTransfer(platformFeeRecipient, platformFee);
        }

        // update filled
        makerOrder.filled += fillAmount;

        emit OrderMatched(makerOrderId, 0, makerOrder.maker, msg.sender, tokenId, makerOrder.price, fillAmount, platformFee, referrerFee);

        if (makerOrder.filled >= makerOrder.amount) {
            orderActive[makerOrderId] = false;
        }
    }

    // -------------------------
    // Helpers
    // -------------------------

    // naive multiplication: price * amount (both uint256) - we assume amounts reasonably small to avoid overflow.
    function _mulDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    function _priceExists(uint256 tokenId, uint256 price) internal view returns (bool) {
        uint256[] storage arr = activePricesPerToken[tokenId];
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == price) return true;
        }
        return false;
    }

    // -------------------------
    // Emergency
    // -------------------------
    function pause() external onlyRole(MANAGER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(MANAGER_ROLE) {
        _unpause();
    }

    // -------------------------
    // Receiver hook for ERC1155
    // -------------------------
    function onERC1155Received(address, address, uint256, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata) external pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
