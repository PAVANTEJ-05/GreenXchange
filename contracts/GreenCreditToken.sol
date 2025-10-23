// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/// @title GreenCreditToken
/// @notice ERC-1155 token for tokenized green credits (Green, Carbon, Water, Renewable)
///         Fully on-chain metadata via Base64-encoded JSON.
contract GreenCreditToken is ERC1155, Ownable {
    // ---------------------------------------------------------
    // ENUMS & STRUCTS
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // STORAGE
    // ---------------------------------------------------------
    mapping(uint256 => CreditInfo) private creditData;
    mapping(address => mapping(uint256 => MintApproval)) public approvedMints;
    mapping(address => mapping(uint256 => bool)) public tokenFrozen;
    mapping(uint256 => uint256) public totalSupply;
    mapping(uint256 => uint256) public totalRetired;

    // ---------------------------------------------------------
    // EVENTS
    // ---------------------------------------------------------
    event CreditRegistered(uint256 indexed tokenId, CreditType creditType, string projectTitle, string certificateHash);
    event MintApprovalGranted(address indexed user, uint256 indexed tokenId, uint256 amount, uint256 expiry);
    event MintApprovalRevoked(address indexed user, uint256 indexed tokenId);
    event TokenMinted(address indexed user, uint256 indexed tokenId, uint256 amount);
    event CreditRevoked(uint256 indexed tokenId);
    event TokensFrozen(address indexed user, uint256 indexed tokenId);
    event TokensUnfrozen(address indexed user, uint256 indexed tokenId);
    event TokenRetired(address indexed user, uint256 indexed tokenId, uint256 amount, string reason);

    // ---------------------------------------------------------
    // CONSTRUCTOR
    // ---------------------------------------------------------
    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    // ---------------------------------------------------------
    // VALIDATION HELPERS
    // ---------------------------------------------------------
    function _isValidProjectTitle(string memory title) internal pure returns (bool) {
        uint256 len = bytes(title).length;
        return len > 0 && len <= 30;
    }

    function _isValidCertificateHash(string memory hash) internal pure returns (bool) {
        uint256 len = bytes(hash).length;
        return len >= 46 && len <= 128;
    }

    // ---------------------------------------------------------
    // CREDIT REGISTRATION
    // ---------------------------------------------------------
    function registerCredit(
        uint256 tokenId,
        CreditType creditType,
        string calldata projectTitle,
        string calldata location,
        string calldata certificateHash
    ) external onlyOwner {
        require(!creditData[tokenId].exists, "Credit ID exists");
        require(_isValidProjectTitle(projectTitle), "Invalid title");
        require(_isValidCertificateHash(certificateHash), "Invalid certificate hash");

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

    // ---------------------------------------------------------
    // MINT APPROVAL
    // ---------------------------------------------------------
    function approveMint(address user, uint256 tokenId, uint256 amount, uint256 expiryTimestamp) external onlyOwner {
        require(user != address(0), "Invalid user");
        require(creditData[tokenId].exists, "Token ID missing");
        require(!creditData[tokenId].revoked, "Credit revoked");
        require(amount > 0, "Zero amount");
        require(expiryTimestamp > block.timestamp, "Expiry past");

        approvedMints[user][tokenId] = MintApproval({
            amount: amount,
            expiry: expiryTimestamp
        });

        emit MintApprovalGranted(user, tokenId, amount, expiryTimestamp);
    }

    function revokeMintApproval(address user, uint256 tokenId) external onlyOwner {
        require(
            approvedMints[user][tokenId].amount > 0 || approvedMints[user][tokenId].expiry > 0,
            "No approval"
        );
        approvedMints[user][tokenId].amount = 0;
        approvedMints[user][tokenId].expiry = 0;
        emit MintApprovalRevoked(user, tokenId);
    }

    // ---------------------------------------------------------
    // MINTING
    // ---------------------------------------------------------
    function mintApprovedToken(uint256 tokenId, uint256 amount) external {
        CreditInfo storage credit = creditData[tokenId];
        require(credit.exists, "Credit missing");
        require(!credit.revoked, "Credit revoked");
        require(!tokenFrozen[msg.sender][tokenId], "Frozen");
        require(amount > 0, "Zero amount");

        MintApproval storage approval = approvedMints[msg.sender][tokenId];
        require(approval.amount > 0, "No approval");
        require(block.timestamp <= approval.expiry, "Approval expired");
        require(amount <= approval.amount, "Exceeds approval");

        _mint(msg.sender, tokenId, amount, "");
        totalSupply[tokenId] += amount;

        approval.amount -= amount;
        if (approval.amount == 0) approval.expiry = 0;

        emit TokenMinted(msg.sender, tokenId, amount);
    }

    // ---------------------------------------------------------
    // RETIRE / BURN
    // ---------------------------------------------------------
    function retire(uint256 tokenId, uint256 amount, string calldata reason) external {
        require(amount > 0, "Invalid amount");
        require(balanceOf(msg.sender, tokenId) >= amount, "Insufficient");
        require(!creditData[tokenId].revoked, "Revoked");
        require(!tokenFrozen[msg.sender][tokenId], "Frozen");

        _burn(msg.sender, tokenId, amount);

        if (totalSupply[tokenId] >= amount) totalSupply[tokenId] -= amount;
        else totalSupply[tokenId] = 0;

        totalRetired[tokenId] += amount;
        emit TokenRetired(msg.sender, tokenId, amount, reason);
    }

    // ---------------------------------------------------------
    // REVOKE / FREEZE
    // ---------------------------------------------------------
    function revokeCredit(uint256 tokenId) external onlyOwner {
        require(creditData[tokenId].exists, "Missing credit");
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

    // ---------------------------------------------------------
    // ON-CHAIN METADATA (BASE64 JSON)
    // ---------------------------------------------------------
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(creditData[tokenId].exists, "Token missing");
        CreditInfo memory info = creditData[tokenId];

        string memory json = string(
            abi.encodePacked(
                '{"name":"',
                info.projectTitle,
                '","description":"On-chain Green Credit representing ',
                _creditTypeToString(info.creditType),
                ' project located at ',
                info.location,
                '","certificateHash":"',
                info.certificateHash,
                '","attributes":[{"trait_type":"CreditType","value":"',
                _creditTypeToString(info.creditType),
                '"},{"trait_type":"Revoked","value":"',
                info.revoked ? "true" : "false",
                '"}]}'
            )
        );

        string memory encoded = Base64.encode(bytes(json));
        return string(abi.encodePacked("data:application/json;base64,", encoded));
    }

    function _creditTypeToString(CreditType c) internal pure returns (string memory) {
        if (c == CreditType.Green) return "Green";
        if (c == CreditType.Carbon) return "Carbon";
        if (c == CreditType.Water) return "Water";
        if (c == CreditType.Renewable) return "Renewable";
        return "";
    }

    // ---------------------------------------------------------
    // READ HELPERS
    // ---------------------------------------------------------
    function getCreditInfo(uint256 tokenId) external view returns (CreditInfo memory) {
        require(creditData[tokenId].exists, "Credit missing");
        return creditData[tokenId];
    }

    function isUserTokenFrozen(address user, uint256 tokenId) external view returns (bool) {
        return tokenFrozen[user][tokenId];
    }

    // ---------------------------------------------------------
    // ERC1155 _update HOOK (OZ v5)
    // ---------------------------------------------------------
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override {
        super._update(from, to, ids, values);

        if (from == address(0) || to == address(0)) return; // mint/burn OK

        for (uint256 i = 0; i < ids.length; i++) {
            uint256 tokenId = ids[i];
            require(!creditData[tokenId].revoked, "GreenX: Credit revoked");
            require(!tokenFrozen[from][tokenId], "GreenX: Token frozen");
        }
    }

    // ---------------------------------------------------------
    // REJECT DIRECT ETH
    // ---------------------------------------------------------
    receive() external payable {
        revert("No ETH");
    }

    fallback() external payable {
        revert("Unsupported");
    }
}
