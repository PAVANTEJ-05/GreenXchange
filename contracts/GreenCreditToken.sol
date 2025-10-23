// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title GreenCreditToken
/// @notice ERC-1155 token contract for tokenized green credits with approval-based minting, freezing, and retirement.
contract GreenCreditToken is ERC1155, Ownable {

    enum CreditType { Green, Carbon, Water, Renewable }

    struct CreditInfo {
        CreditType creditType;
        string projectTitle;
        string location;
        string certificateHash;
        bool exists;
        bool revoked;
    }

    struct MintApproval {
        uint256 amount;
        uint256 expiry;
    }

    // Storage
    mapping(uint256 => CreditInfo) private creditData;
    mapping(address => mapping(uint256 => MintApproval)) public approvedMints;
    mapping(address => mapping(uint256 => bool)) public tokenFrozen;
    mapping(uint256 => uint256) public totalSupply;
    mapping(uint256 => uint256) public totalRetired;

    string private _baseURI;

    // Events
    event CreditRegistered(uint256 indexed tokenId, CreditType creditType, string projectTitle, string certificateHash);
    event MintApprovalGranted(address indexed user, uint256 indexed tokenId, uint256 amount, uint256 expiry);
    event MintApprovalRevoked(address indexed user, uint256 indexed tokenId);
    event TokenMinted(address indexed user, uint256 indexed tokenId, uint256 amount);
    event CreditRevoked(uint256 indexed tokenId);
    event TokensFrozen(address indexed user, uint256 indexed tokenId);
    event TokensUnfrozen(address indexed user, uint256 indexed tokenId);
    event BaseURIUpdated(string oldURI, string newURI);
    event TokenRetired(address indexed user, uint256 indexed tokenId, uint256 amount, string reason);

    // Constructor (OZ v5 needs initialOwner)
    constructor(string memory baseURI_, address initialOwner) ERC1155(baseURI_) Ownable(initialOwner) {
        _baseURI = baseURI_;
    }

    // -------------------------
    // Validation Helpers
    // -------------------------
    function _isValidProjectTitle(string memory title) internal pure returns (bool) {
        uint256 len = bytes(title).length;
        return len > 0 && len <= 30;
    }

    function _isValidCertificateHash(string memory hash) internal pure returns (bool) {
        uint256 len = bytes(hash).length;
        return len >= 46 && len <= 128;
    }

    // -------------------------
    // Credit Registration
    // -------------------------
    function registerCredit(
        uint256 tokenId,
        CreditType creditType,
        string calldata projectTitle,
        string calldata location,
        string calldata certificateHash
    ) external onlyOwner {
        require(!creditData[tokenId].exists, "Credit ID already exists");
        require(_isValidProjectTitle(projectTitle), "Project title invalid");
        require(_isValidCertificateHash(certificateHash), "Certificate hash invalid");

        creditData[tokenId] = CreditInfo({
            creditType: creditType,
            projectTitle: projectTitle,
            location: location,
            certificateHash: certificateHash,
            exists: true,
            revoked: false
        });

        emit CreditRegistered(tokenId, creditType, projectTitle, certificateHash);
    }

    // -------------------------
    // Mint Approval
    // -------------------------
    function approveMint(address user, uint256 tokenId, uint256 amount, uint256 expiryTimestamp) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(creditData[tokenId].exists, "Token ID does not exist");
        require(!creditData[tokenId].revoked, "Credit revoked");
        require(amount > 0, "Amount must be > 0");
        require(expiryTimestamp > block.timestamp, "Expiry must be future");

        approvedMints[user][tokenId] = MintApproval({
            amount: amount,
            expiry: expiryTimestamp
        });

        emit MintApprovalGranted(user, tokenId, amount, expiryTimestamp);
    }

    function revokeMintApproval(address user, uint256 tokenId) external onlyOwner {
        require(approvedMints[user][tokenId].amount > 0 || approvedMints[user][tokenId].expiry > 0, "No approval exists");
        approvedMints[user][tokenId].amount = 0;
        approvedMints[user][tokenId].expiry = 0;
        emit MintApprovalRevoked(user, tokenId);
    }

    // -------------------------
    // Minting
    // -------------------------
    function mintApprovedToken(uint256 tokenId, uint256 amount) external {
        CreditInfo storage credit = creditData[tokenId];
        require(credit.exists, "Credit does not exist");
        require(!credit.revoked, "Credit revoked");
        require(!tokenFrozen[msg.sender][tokenId], "Token frozen for user");
        require(amount > 0, "Amount must be > 0");

        MintApproval storage approval = approvedMints[msg.sender][tokenId];
        require(approval.amount > 0, "No mint approval");
        require(block.timestamp <= approval.expiry, "Approval expired");
        require(amount <= approval.amount, "Amount exceeds approved");

        _mint(msg.sender, tokenId, amount, "");
        totalSupply[tokenId] += amount;

        approval.amount -= amount;
        if (approval.amount == 0) approval.expiry = 0;

        emit TokenMinted(msg.sender, tokenId, amount);
    }

    // -------------------------
    // Retire / Burn
    // -------------------------
    function retire(uint256 tokenId, uint256 amount, string calldata reason) external {
        require(amount > 0, "Invalid amount");
        require(balanceOf(msg.sender, tokenId) >= amount, "Insufficient balance");
        require(!creditData[tokenId].revoked, "Credit revoked");
        require(!tokenFrozen[msg.sender][tokenId], "Token frozen");

        _burn(msg.sender, tokenId, amount);

        if (totalSupply[tokenId] >= amount) {
            totalSupply[tokenId] -= amount;
        } else {
            totalSupply[tokenId] = 0;
        }
        totalRetired[tokenId] += amount;

        emit TokenRetired(msg.sender, tokenId, amount, reason);
    }

    // -------------------------
    // Revocation & Freezing
    // -------------------------
    function revokeCredit(uint256 tokenId) external onlyOwner {
        require(creditData[tokenId].exists, "Credit does not exist");
        creditData[tokenId].revoked = true;
        emit CreditRevoked(tokenId);
    }

    function freezeUserToken(address user, uint256 tokenId) external onlyOwner {
        tokenFrozen[user][tokenId] = true;
        emit TokensFrozen(user, tokenId);
    }

    function unfreezeUserToken(address user, uint256 tokenId) external onlyOwner {
        tokenFrozen[user][tokenId] = false;
        emit TokensUnfrozen(user, tokenId);
    }

    // -------------------------
    // Base URI
    // -------------------------
    function setBaseURI(string memory newURI) external onlyOwner {
        emit BaseURIUpdated(_baseURI, newURI);
        _baseURI = newURI;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        require(creditData[tokenId].exists, "Token does not exist");
        return string(abi.encodePacked(_baseURI, Strings.toString(tokenId), ".json"));
    }

    // -------------------------
    // Read helpers
    // -------------------------
    function getCreditInfo(uint256 tokenId) external view returns (CreditInfo memory) {
        require(creditData[tokenId].exists, "Credit does not exist");
        return creditData[tokenId];
    }

    function isUserTokenFrozen(address user, uint256 tokenId) external view returns (bool) {
        return tokenFrozen[user][tokenId];
    }

    // -------------------------
    // ERC1155 _update Hook (OZ v5)
    // -------------------------
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override {
        // Run parent logic
        super._update(from, to, ids, values);

        if (from == address(0) || to == address(0)) return; // mint/burn allowed

        for (uint256 i = 0; i < ids.length; i++) {
            uint256 tokenId = ids[i];
            require(!creditData[tokenId].revoked, "GreenX: Credit revoked");
            require(!tokenFrozen[from][tokenId], "GreenX: Sender token frozen");
        }
    }

    // -------------------------
    // Reject ETH
    // -------------------------
    receive() external payable {
        revert("Contract does not accept ETH");
    }

    fallback() external payable {
        revert("Unsupported call");
    }
}