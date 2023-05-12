require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-watcher");
require("hardhat-gas-reporter");
require('solidity-coverage');
require('hardhat-storage-layout');

// TODO
// Create secrets.json myself.
// Update package.json?
const { 
  alchemyApiKey, 
  privateKey, 
  bscscanApiKey, 
  polygonscanApiKey, 
  avalanchescanApiKey,
  coinmarketcapKey 
} = require('./secrets.json');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  // solidity: "0.8.10",
  // solidity: {
  //   // ...
  //   contracts: [
  //     {
  //       // ...
  //       artifacts: 'path/to/artifacts/contracts',
  //     },
  //   ],
  // },
  solidity: {
    compilers: [
      {
        version: '0.8.10',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  // scripts and contracts had " " at the end and had to fix that
  // paths: {
  //   sources: "./contracts",
  //   tests: "./test",
  //   cache: "./cache",
  //   artifacts: "./artifacts"
  // },
  settings: {
    optimizer: {
      enabled: true,
      runs: 1,
    }
  },
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-2-s2.binance.org:8545",
      accounts: [privateKey]
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.blockpi.network/v1/rpc/public`,
      accounts: [privateKey]
    },
    // TODO
    // Make the script to work with this
    avalancheFuji: {
      // https://docs.avax.network/dapps/smart-contracts/deploy-a-smart-contract-on-avalanche-using-remix-and-metamask#fuji-testnet-settings
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      accounts: [privateKey]
    },
    hardhat: {
      accounts: {
        count: 200,
      }
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: `${bscscanApiKey}`,
      polygonMumbai: `${polygonscanApiKey}`,
      avalancheFuji: `${avalanchescanApiKey}`,
    },
  },
  gasReporter: {
    currency: 'USD',
    coinmarketcap: `${coinmarketcapKey}`,
    enabled: (process.env.REPORT_GAS) ? true : false
  }
};
