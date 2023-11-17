// SPDX-License-Identifier: BSD-4-Clause
pragma solidity 0.8.13;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract TokenWithMerkle is ERC20, Ownable {
    uint256 public cost = 0.01 ether;
    // merkle root is the hash of blacklisted wallets

    bytes32 public merkleRoot;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        bytes32 _merkleRoot
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, _totalSupply * (10**decimals()));
        merkleRoot = _merkleRoot;
    }

    function transfer(address _to, uint256 _value) public override returns (bool) {
        bytes32[] memory data = new bytes32[](0);
        _transferWithProof(msg.sender, _to, _value, data);
        return true;
    }

    function transferWithProof(
        address _to,
        uint256 _value,
        bytes32[] memory _proof
    ) external {
        _transferWithProof(msg.sender, _to, _value, _proof);
    }

    function _transferWithProof(
        address _from,
        address _to,
        uint256 _value,
        bytes32[] memory _proof
    ) internal {
        bytes32 leaf = keccak256(abi.encodePacked(_from));
        require(MerkleProof.verify(_proof, merkleRoot, leaf), "ERC20: user blacklisted");
        _transfer(_from, _to, _value);
    }

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }
}
