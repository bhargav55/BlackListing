const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
require("dotenv").config({ path: __dirname + "/.env" });
// dotenvConfig({ path: resolve(__dirname, "./.env") });
let mnemonic;
if (!process.env.MNEMONIC) {
  throw new Error("Please set your MNEMONIC in a .env file");
} else {
  mnemonic = process.env.MNEMONIC;
}

let infuraApiKey;
if (!process.env.INFURA_API_KEY) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
} else {
  infuraApiKey = process.env.INFURA_API_KEY;
}

module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    fuji: {
      provider: function () {
        return new Web3.providers.HttpProvider("https://api.avax-test.network/ext/bc/C/rpc");
      },
      network_id: "43113",
      gas: 3000000,
      gasPrice: 470000000000,
      timeoutBlocks: 60, // must be greater than Web3's default (50)
      accounts: { mnemonic: mnemonic },
      from: "0xEfA074a29cBFe0B700440bbace6A10f306628da5",
    },
    rinkeby: {
      network_id: "4",
      provider: function () {
        return new HDWalletProvider(mnemonic, "wss://rinkeby.infura.io/ws/v3/" + infuraApiKey, 0, 3);
      },
      networkCheckTimeout: 100000000,
      timeoutBlocks: 2000,
      // timeoutBlocks: 60, // must be greater than Web3's default (50)
      // accounts: { mnemonic: mnemonic },
      from: "0xEfA074a29cBFe0B700440bbace6A10f306628da5",
    },
    matic_mumbai: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "wss://polygon-mumbai.infura.io/ws/v3/" + infuraApiKey, 0, 3);
      },
      network_id: "80001",
      networkCheckTimeout: 100000000,
      timeoutBlocks: 2000,
    },
    matic_mainnet: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://polygon-mainnet.infura.io/v3/" + infuraApiKey, 0, 3);
      },
      network_id: "137",
      networkCheckTimeout: 100000000,
      timeoutBlocks: 2000,
      gasPrice: 50000000000,
    },
  },
  //
  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows:
  // $ truffle migrate --reset --compile-all
  //
  db: {
    enabled: true,
    host: "127.0.0.1",
    adapter: {
      name: "sqlite",
      settings: {
        directory: ".db",
      },
    },
  },
  compilers: {
    solc: {
      version: "0.8.13", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
      //  evmVersion: "byzantium"
      // }
    },
  },
  plugins: ["truffle-plugin-verify", "truffle-contract-size"],
  api_keys: {
    etherscan: "3WNW2H3JR7H3FZVJS7Q4YPVC41N8F57DDB",
    polygonscan: "QH8HG9X72DTXG18RBQTTV1AKPV4IH2Y34G",
  },
};
