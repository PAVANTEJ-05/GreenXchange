// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// import "forge-std/Script.sol";
import "../contracts/GreenCreditToken.sol";
import "../contracts/GreenXchangeOrderbook.sol";
import "../contracts/MOCK_PYUSD.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        address admin = msg.sender;

        // Deploy mock PYUSD (for staging)
        MOCK_PYUSD pyusd = new MOCK_PYUSD("Mock PYUSD", "mPYUSD", 6);
        // Deploy token
        GreenCreditERC1155 credits = new GreenCreditERC1155();
        credits.initialize("https://example.com/metadata/{id}.json", admin);

        // Deploy DEX
        GreenXchangeOrderbook dex = new GreenXchangeOrderbook();
        dex.initialize(admin, address(credits), address(pyusd), 6, admin, 50); // 0.5% fee default

        // Grant minter role to admin
        credits.grantRole(keccak256("MINTER_ROLE"), admin);
        credits.grantRole(keccak256("BURNER_ROLE"), admin);
        credits.grantRole(keccak256("MANAGER_ROLE"), admin);
        credits.grantRole(keccak256("UPGRADER_ROLE"), admin);

        vm.stopBroadcast();
    }
}
