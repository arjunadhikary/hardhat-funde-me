const { deployments, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

//run this only on development environment
const { DECIMAL, INITIAL_ANSWER } = require("../helper-hardhat-config")
module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (developmentChains.includes(network.name)) {
        log("Local network detected. Deploying mock Contract")
        await deploy("MockV3Aggregator", {
            from: deployer,
            args: [DECIMAL, INITIAL_ANSWER],
            log: true,
        })
        log("Mock Contract Depolyed")
        log("---------------------------------------------------")
    }
}

module.exports.tags = ["mocks", "all"]
