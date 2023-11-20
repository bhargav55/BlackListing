import { ethers } from "hardhat";
import { BigNumber, utils } from "ethers";
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

function sleep(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function main() {
  try {
    const [owner,owner1,owner2] = await ethers.getSigners();
    const ownerAddress = await owner.getAddress();
    const ownerAddress2 = await owner2.getAddress();

    const contract  = await ethers.getContractAt("Token","0x380fA0056c3c36fE16918Cc15EA2d4c7D23F4D89")
    await contract.addBlackList(ownerAddress2)
    console.log("contract: ", contract.address);
  } catch (ex) {
    console.log("ex: ", ex);
  }
}
main();
