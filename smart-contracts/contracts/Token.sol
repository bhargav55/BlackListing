// SPDX-License-Identifier: BSD-4-Clause
pragma solidity 0.8.13;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    event BlackList(address indexed _user);
    event WhiteList(address indexed _user);
    uint256 public cost = 1;
    // we can use merkle root, but we need merkle proof from offchain as param
    mapping(address => bool) blackListed;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {}

    function purchase(uint256 _amount) external payable {
        require(!blackListed[msg.sender], "ERC20: purchase blacklisted");
        require(msg.value == _amount * cost, "ERC20: not enough to purchase");
        (bool success, ) = owner().call{ value: msg.value }("");
        require(success, "TRANSFER_FAILED");
        _mint(msg.sender, _amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(!blackListed[from], "ERC20: sender blacklisted");
        require(!blackListed[to], "ERC20: receiver blackisted");
    }

    function updateBlackList(address[] memory _users) external onlyOwner {
        for (uint256 i = 0; i < _users.length; i++) blackListed[_users[i]] = true;
    }

    function addBlackList(address _user) external onlyOwner {
        blackListed[_user] = true;
        emit BlackList(_user);
    }
    function removeBlackList(address _user) external onlyOwner {
        blackListed[_user] = false;
        emit WhiteList(_user);
    }

    // function addBlack
}
