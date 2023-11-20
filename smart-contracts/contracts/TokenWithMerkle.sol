// SPDX-License-Identifier: BSD-4-Clause
pragma solidity 0.8.13;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract TokenWithMerkle is ERC20, Ownable {
    event BlackList(address indexed _user);
    event WhiteList(address indexed _user);
    uint256 public cost = 1;
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

    // blacklist address are stored in indexer
    // create a merkle tree and get merkle proof, pass while purchasing/ transferring a token
    function purchase(uint256 _amount, bytes32[] memory _proof) external payable {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(!MerkleProof.verify(_proof, merkleRoot, leaf), "ERC20: purchase blacklisted");
        require(msg.value == _amount * cost, "ERC20: not enough to purchase");
        (bool success, ) = owner().call{ value: msg.value }("");
        require(success, "TRANSFER_FAILED");
        _mint(msg.sender, _amount);
    }

    function transfer(address _to, uint256 _value) public override returns (bool) {
        bytes32[] memory fromData = new bytes32[](0);
        bytes32[] memory toData = new bytes32[](0);

        _transferWithProof(msg.sender, _to, _value, fromData, toData);
        return true;
    }

    function transferWithProof(
        address _to,
        uint256 _value,
        bytes32[] memory _fromProof,
        bytes32[] memory _toProof
    ) external {
        _transferWithProof(msg.sender, _to, _value, _fromProof, _toProof);
    }

    function _transferWithProof(
        address _from,
        address _to,
        uint256 _value,
        bytes32[] memory _fromProof,
        bytes32[] memory _toProof
    ) internal {
        require(
            !MerkleProof.verify(_fromProof, merkleRoot, keccak256(abi.encodePacked(_from))),
            "ERC20: user cannot transfer"
        );
        require(
            !MerkleProof.verify(_toProof, merkleRoot, keccak256(abi.encodePacked(_to))),
            "ERC20: user cannot receive"
        );

        _transfer(_from, _to, _value);
    }
    // get the blacklisted wallets from offchain via indexer, create a merkle tree and update roothash
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    // indexer indexes the event and updates the transfer addresses linked to this wallet as blacklist
    function addBlackList(address _user) external onlyOwner {
        emit BlackList(_user);
    }
    // indexer indexes the event and remove the transfer addresses linked to this wallet as blacklist
    function addWhiteList(address _user) external onlyOwner {
        emit WhiteList(_user);
    }
}
