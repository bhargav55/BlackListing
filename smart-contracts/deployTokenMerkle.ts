import { ethers } from "hardhat";
import { BigNumber, utils } from "ethers";
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

function sleep(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function main() {
  try {
    const [owner,owner1] = await ethers.getSigners();
    const ownerAddress = await owner.getAddress();
    const ownerAddress1 = await owner1.getAddress();

    const data = [ownerAddress1];
      // Hash addresses to get the leaves
      let leaves = data.map(addr => keccak256(addr));

      // Create tree
      let merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
      // Get root
      let rootHash = merkleTree.getHexRoot();

    const contractFactory = await ethers.getContractFactory("TokenWithMerkle");
    const contract = await contractFactory.deploy("Test Token Merkle", "MTest", 1000000, rootHash);
    await contract.deployed();
    console.log("contract: ", contract.address);
  } catch (ex) {
    console.log("ex: ", ex);
  }
}
main();
