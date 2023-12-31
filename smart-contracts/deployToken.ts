import { ethers } from "hardhat";
import { BigNumber, utils } from "ethers";

function sleep(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function main() {
  try {
    const [owner] = await ethers.getSigners();
    const ownerAddress = await owner.getAddress();
    console.log("Owner address", ownerAddress);

    const contractFactory = await ethers.getContractFactory("Token");
    const contract = await contractFactory.deploy("Test XToken1", "XTest1");
    await contract.deployed();
    console.log("contract: ", contract.address);
  } catch (ex) {
    console.log("ex: ", ex);
  }
}
main();
