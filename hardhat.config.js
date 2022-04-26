require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-contract-sizer");
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const privateKey = process.env.DEVWALLET;
const url = process.env.INFURA_URL;
const etherScan = process.env.ETHERSCAN;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  optimizer: {
    enabled: true,
    runs: 1000,
  },
  networks: {
    mainnet: {
      url: `${url}`,
      accounts: [`${privateKey}`],
      live: true,
      saveDeployments: true,
      tags: ["production"],
      gasPrice: 69000000000,
    },
    gnosis: {
      url: `https://rpc.gnosischain.com/`,
      accounts: [`${privateKey}`],
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: etherScan
  },
  gasReporter: {
    currency: "usd",
    token: "eth",
    gasPrice: 37
  }
};
