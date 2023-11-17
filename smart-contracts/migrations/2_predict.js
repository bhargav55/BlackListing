const { BigNumber, utils } = require("ethers");

const bhavishAdministratorFactory = artifacts.require("BhavishAdministrator");
const predictFactory = artifacts.require("BhavishPrediction");
const priceManagerFactory = artifacts.require("PriceManager");
const predictionStorageFactory = artifacts.require("BhavishPredictionStorage");
const bhavishSDKFactory = artifacts.require("BhavishSDK");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function (deployer, network, accounts) {
  let bhavishPred = [];
  let bhavishPredStorage = [];
  let assetNames = ["BTC", "ETH", "MATIC"];
  // Matic mainnet
  let aggregators = [
    "0xc907E116054Ad103354f2D350FD2514433D57F6f",
    "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
  ];

  // Matic testnet
  // let aggregators = [
  //   "0x007A22900a3B98143368Bd5906f8E17e9867581b",
  //   "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
  //   "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
  // ];
  // Deploy the admin first
  await deployer.deploy(bhavishAdministratorFactory);
  const bhavishAdmin = await bhavishAdministratorFactory.deployed();

  console.log("Bhavish Adminstrator: ", bhavishAdmin.address);

  // Deploy the price manager
  await deployer.deploy(priceManagerFactory);
  const priceManager = await priceManagerFactory.deployed();

  console.log("Price Manager: ", priceManager.address);

  await priceManager.setManager("0xEfA074a29cBFe0B700440bbace6A10f306628da5");

  // Add the assets to the price manager
  for (let i = 0; i < assetNames.length; i++) {
    await priceManager.setPairContract(
      utils.formatBytes32String(assetNames[i]),
      utils.formatBytes32String("USD"),
      aggregators[i],
    );
  }

  for (let i = 0; i < assetNames.length; i++) {
    // Deploy the storage contract
    await deployer.deploy(predictionStorageFactory);
    const storage = await predictionStorageFactory.deployed();

    // Now deploy the prediction market contract
    await deployer.deploy(
      predictFactory,
      BigNumber.from(utils.parseEther("0.1")),
      BigNumber.from("25"),
      bhavishAdmin.address,
      priceManager.address,
      storage.address,
      utils.formatBytes32String(assetNames[i]),
      utils.formatBytes32String("USD"),
    );
    const predict = await predictFactory.deployed();
    await predict.setOperator("0xEfA074a29cBFe0B700440bbace6A10f306628da5");

    console.log("Prediction market deployed", assetNames[i], ": ", predict.address);
    console.log("Prediction market storage deployed", assetNames[i], ": ", storage.address);
    bhavishPred.push(predict.address);
    bhavishPredStorage.push(storage.address);
  }

  let strikeValues = [];
  let underlyingValues = [];
  for (let i = 0; i < assetNames.length; i++) {
    underlyingValues.push(utils.formatBytes32String(assetNames[i]));
    strikeValues.push(utils.formatBytes32String("USD"));
  }

  // Deploy the sdk
  await deployer.deploy(bhavishSDKFactory, bhavishPred, underlyingValues, strikeValues);

  const bhavishSDK = await bhavishSDKFactory.deployed();

  console.log("Bhavish SDK deployed: ", bhavishSDK.address);

  for (i = 0; i < assetNames.length; i++) {
    let val = await predictFactory.at(bhavishPred[i]);
    await val.setBhavishSDK(bhavishSDK.address);
  }
};
