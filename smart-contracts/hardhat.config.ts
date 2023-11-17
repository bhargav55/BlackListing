import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import "@nomiclabs/hardhat-etherscan";

dotenvConfig({ path: resolve(__dirname, "./.env") });

import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import "./tasks/accounts";
import "./tasks/clean";

import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import "solidity-coverage";

import "hardhat-contract-sizer";

const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
  bsc: 97,
  matic: 80001,
  bscmainnet: 56,
  fuji: 43113,
  avax: 43114,
  arbitrum: 421611,
  arbitrum_mainnet: 42161,
  polygonmainnet: 137,
  hedera: 295,
};

// Ensure that we have all the environment variables we need.
let mnemonic: string;
if (!process.env.MNEMONIC) {
  throw new Error("Please set your MNEMONIC in a .env file");
} else {
  mnemonic = process.env.MNEMONIC;
}

let infuraApiKey: string;
if (!process.env.INFURA_API_KEY) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
} else {
  infuraApiKey = process.env.INFURA_API_KEY;
}

function createTestnetConfig(network: keyof typeof chainIds): NetworkUserConfig {
  let url: string;
  if (network == "bsc") {
    url = "https://data-seed-prebsc-1-s3.binance.org:8545";
  } else if (network == "bscmainnet") {
    url = "https://bsc-dataseed3.binance.org";
  } else if (network == "matic") {
    url = "https://rpc-mumbai.maticvigil.com/";
  } else if (network == "fuji") {
    url = "https://api.avax-test.network/ext/bc/C/rpc";
  } else if (network == "avax") {
    url = "https://api.avax.network/ext/bc/C/rpc";
  } else if (network == "arbitrum") {
    url = "https://rinkeby.arbitrum.io/rpc";
  } else if (network == "arbitrum_mainnet") {
    url = "https://arb1.arbitrum.io/rpc";
  } else if (network == "polygonmainnet") {
    url = "https://polygon-mainnet.infura.io/v3/9020d984dfd94edaa8f7605a074ea000";
  } else if (network == "hedera") {
    url = "https://mainnet.hashio.io/api";
  } else {
    url = "https://" + network + ".infura.io/v3/" + infuraApiKey;
  }
  return {
    url: url,
    chainId: chainIds[network],
    accounts: [process.env.HEDERA_HEX_PRIVATE_KEY1 || ""],
    gas: "auto",
    gasPrice: "auto",
    gasMultiplier: 3,
  };

  // return {
  //   accounts: {
  //     count: 10,
  //     initialIndex: 0,
  //     mnemonic,
  //     path: "m/44'/60'/0'/0",
  //   },
  //   chainId: chainIds[network],
  //   url,
  //   timeout: 1000000,
  //   gasMultiplier: 2,
  //   gasPrice: "auto",
  // };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: chainIds.hardhat,
    },
    goerli: createTestnetConfig("goerli"),
    kovan: createTestnetConfig("kovan"),
    rinkeby: createTestnetConfig("rinkeby"),
    ropsten: createTestnetConfig("ropsten"),
    bsc: createTestnetConfig("bsc"),
    matic: createTestnetConfig("matic"),
    bscmainnet: createTestnetConfig("bscmainnet"),
    fuji: createTestnetConfig("fuji"),
    avax: createTestnetConfig("avax"),
    arbitrum: createTestnetConfig("arbitrum"),
    polygonmainnet: createTestnetConfig("polygonmainnet"),
    arbitrum_mainnet: createTestnetConfig("arbitrum_mainnet"),
    hedera: createTestnetConfig("hedera"),
  },
  etherscan: {
    apiKey: {
      polygon: "QH8HG9X72DTXG18RBQTTV1AKPV4IH2Y34G",
      bsc: "1KAZ4SJGQ1XUNBZTKMABFANY5BAMR2T5QF",
      arbitrumOne: "6PMCCZ7M3BZ48WPPRN55UYK3F9MNXRE314",
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.13",
    settings: {
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 100000,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
};

export default config;
