// SPDX-License-Identifier: BSD-4-Clause
pragma solidity 0.8.13;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    uint256 public cost = 0.01 ether;
    // we can use merkle root, but we need merkle proof from offchain as param
    mapping(address => bool) blackListed;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, _totalSupply * (10**decimals()));
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(!blackListed[from], "ERC20: sender blacklisted");
        require(!blackListed[to], "ERC20: receiver blackisted");
    }

    function setBlackListed(address[] memory _users) external onlyOwner {
        for (uint256 i = 0; i < _users.length; i++) blackListed[_users[i]] = true;
    }
}
