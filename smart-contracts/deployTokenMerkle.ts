import { ethers } from "hardhat";
import { BigNumber, utils } from "ethers";

function sleep(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function main() {
  try {
    const contractFactory = await ethers.getContractFactory("TokenWithMerkle");
    const contract = await contractFactory.deploy("Test Token Merkle", "MTest", 1000000);
    await contract.deployed();
    console.log("contract: ", contract.address);
  } catch (ex) {
    console.log("ex: ", ex);
  }
}
main();
