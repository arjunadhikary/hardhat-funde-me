const priceFeedConfig = {
    5: {
        name: "Goerli",
        addressUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
    137: {
        name: "Polygon",
        addressUsdPriceFeed: "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676"
    }
    //testnet 31337
}

const developmentChains = ["localhost", "hardhat"]
const DECIMAL = 8
const INITIAL_ANSWER = 100000000000
module.exports = {
    priceFeedConfig,
    INITIAL_ANSWER,
    DECIMAL,
    developmentChains
}
