require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()
require("hardhat-gas-reporter")

const GOERIL_ADDRESS = process.env.GOERIL_ADDRESS || ""
const GOERIL_URL = process.env.GOERIL_URL || ""
const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY || ""
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }]
    },
    etherscan: {
        apiKey: ETHERSCAN_APIKEY
    },
    networks: {
        goerli: {
            url: GOERIL_URL,
            accounts: [GOERIL_ADDRESS],
            chainId: 5,
            blockConfirmation: 4,
            gas: 2100000,
            gasPrice: 6000000000
        }
    },
    gasReporter: {
        currency: "USD",
        coinmarketcap: "8058ea45-42d2-4bbd-837d-9d43eae20c1c",
        enabled: true,
        noColors: true,
        outputFile: "report.txt",
        token: "ETH"
    },
    namedAccounts: {
        deployer: {
            default: 0 // here this will by default take the first account as deployer
        }
    }
}
