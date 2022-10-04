require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()

const GOERIL_ADDRESS = process.env.GOERIL_ADDRESS || ""
const GOERIL_URL = process.env.GOERIL_URL || ""
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },
    networks: {
        goerli: {
            url: GOERIL_URL,
            accounts: [GOERIL_ADDRESS],
            chainId: 5,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
        },
    },
}
