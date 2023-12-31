// SPDX-License-Identifier: BSD-4-Clause
pragma solidity 0.8.13;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract TokenWithSignature is ERC20, Ownable {
    using ECDSA for bytes32;
    uint256 public cost = 0.01 ether;

    // relayer address
    address private signerAddress = 0xa0b22BbCDF7dbe1E7A39ECd79130b882B3A6C102;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, _totalSupply * (10**decimals()));
    }

    function transfer(address _to, uint256 _value) public override returns (bool) {
        _transferWithSignature(msg.sender, _to, _value, "");
        return true;
    }

    function transferWithSignature(
        address _to,
        uint256 _value,
        bytes memory signature
    ) external {
        _transferWithSignature(msg.sender, _to, _value, signature);
    }

    // blacklist wallets are stored inside a relayer
    // txn is first sent to relayer, validates the user, then sends txn onchain
    // validate the signature so that msg.sender is always relayer
    function _transferWithSignature(
        address _from,
        address _to,
        uint256 _value,
        bytes memory _signature
    ) internal {
        bytes32 messageHash = keccak256(abi.encodePacked(_from));
        require(signerAddress == messageHash.toEthSignedMessageHash().recover(_signature), "invalid signature");
        _transfer(_from, _to, _value);
    }
}
