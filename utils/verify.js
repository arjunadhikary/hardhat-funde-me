const { run } = require("hardhat")

const verify = async function (address, args) {
    try {
        await run("verify:verify", {
            address,
            constructorArguments: args,
        })
    } catch (error) {
        if (error.message.toLowerCase().contains("already verified")) {
            console.log("Contract is Already Verified")
        } else {
            console.log(error)
        }
    }
}

module.exports = verify
