const { network } = require("hardhat")

const {
    priceFeedConfig,
    developmentChains,
} = require("../helper-hardhat-config")
module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdFeedAddress = priceFeedConfig[chainId]["addressUsdPriceFeed"]
    }
    await deploy("FundMe", {
        from: deployer,
        log: true,
        args: [ethUsdFeedAddress],
    })
    log("-------------------------------------------------------------")
}

module.exports.tags = ["all", "main"]
