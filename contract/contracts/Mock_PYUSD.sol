// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title MOCK_PYUSD
/// @notice Mock ERC20 for tests: configurable decimals (default 6) and a faucet function
import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

contract MOCK_PYUSD is ERC20, Ownable {
    uint8 private _decimals;

    constructor(string memory name_, string memory symbol_, uint8 decimals_) ERC20(name_, symbol_) {
        _decimals = decimals_;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /// @notice Faucet/mint for tests
    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
