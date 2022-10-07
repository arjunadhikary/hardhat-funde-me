const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { assert, expect } = require("chai")

describe("Test  FundMe", async function() {
    let fundMe
    let deployer
    let mockAVI
    const transferedEther = ethers.utils.parseEther("100")
    beforeEach(async function() {
        // await ethers.getSigners()
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockAVI = await ethers.getContract("MockV3Aggregator", deployer)
    })

    describe("Constructor", async function() {
        it("checks to see if AVI is set correctly", async function() {
            const AVI = await fundMe.priceFeed()
            assert.equal(AVI, mockAVI.address)
        })
    })

    describe("Fund", async function() {
        it("Fails if enough contract isnot send", async function() {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
        it("checks the sent amount", async function() {
            await fundMe.fund({ value: transferedEther })
            const response = await fundMe.addressToAmountFunded(deployer)

            assert.equal(response.toString(), transferedEther.toString())
        })
        it("checks the funders address", async function() {
            await fundMe.fund({ value: transferedEther })
            const funder = await fundMe.funders(0)
            assert.equal(deployer, funder)
        })
    })
    describe("Withdraw Balance", async function() {
        beforeEach(async function() {
            await fundMe.fund({ value: transferedEther })
        })

        it("Withdraws Actual Amount from the contract", async function() {
            const initialBalanceofContract = await fundMe.provider.getBalance(
                fundMe.address
            )
            const initialBalanceofDeployer = await fundMe.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundMe.withdraw()

            const transactionReceipt = await transactionResponse.wait(1)

            const finalBalanceofContract = await fundMe.provider.getBalance(
                fundMe.address
            )
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasUsedCost = gasUsed.mul(effectiveGasPrice)

            const finalBalanceofDeployer = await fundMe.provider.getBalance(
                deployer
            )
            assert.equal(finalBalanceofContract.toString(), 0)
            assert.equal(
                initialBalanceofContract
                    .add(initialBalanceofDeployer)
                    .toString(),
                finalBalanceofDeployer.add(gasUsedCost).toString()
            )
        })
    })
})
