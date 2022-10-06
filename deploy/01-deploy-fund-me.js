const { network } = require("hardhat")

const {
    priceFeedConfig,
    developmentChains
} = require("../helper-hardhat-config")
const verify = require("../utils/verify")
module.exports = async function({ deployments, getNamedAccounts }) {
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
    const fundMe = await deploy("FundMe", {
        from: deployer,
        log: true,
        args: [ethUsdFeedAddress],
        waitConfirmation: network.config.blockConfirmation || 1
    })
    log("-------------------------------------------------------------")

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_APIKEY
    ) {
        await verify(fundMe.address || "", [ethUsdFeedAddress])
    }
}

module.exports.tags = ["all", "main"]
