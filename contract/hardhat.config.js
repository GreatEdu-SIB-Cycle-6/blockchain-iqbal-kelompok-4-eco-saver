require("@matterlabs/hardhat-zksync-solc");
require ("@nomicfoundation/hardhat-toolbox");

require("@matterlabs/hardhat-zksync-solc");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  zksolc: {
    version: "1.3.9",
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  paths: {
    artifacts: "./artifacts-zk",
    cache: "./cache-zk",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.20",
    defaultNetwork : 'bsc',
    networks : {
      hardhat : {},
      bscTestnet: {
        url: "https://bsc-testnet.publicnode.com",
        accounts : [`0x${process.env.PRIVATE_KEY}`],
        chainId : 97,
      }
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};