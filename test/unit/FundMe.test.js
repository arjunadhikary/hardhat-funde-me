const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { assert, expect } = require("chai")

describe("Test  FundMe", async function() {
    let fundMe
    let deployer
    let mockAVI
    const transferedEther = ethers.utils.parseEther("1")
    beforeEach(async function() {
        // await ethers.getSigners()
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockAVI = await ethers.getContract("MockV3Aggregator", deployer)
    })

    describe("Constructor", async function() {
        it("checks to see if AVI is set correctly", async function() {
            const AVI = await fundMe.getPriceFeed()
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
            const response = await fundMe.getaddressToAmountFunded(deployer)

            assert.equal(response.toString(), transferedEther.toString())
        })
        it("checks the funders address", async function() {
            await fundMe.fund({ value: transferedEther })
            const funder = await fundMe.getFunder(0)
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

            const transactionResponse = await fundMe.optimizedwithdraw()

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

    it("It is unoptimised Withdraw", async function() {
        const initialBalanceofContract = await fundMe.provider.getBalance(
            fundMe.address
        )
        const initialBalanceofDeployer = await fundMe.provider.getBalance(
            deployer
        )

        const transactionResponse = await fundMe.unoptimizedwithdraw()

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
            initialBalanceofContract.add(initialBalanceofDeployer).toString(),
            finalBalanceofDeployer.add(gasUsedCost).toString()
        )
    })

    it("allows to Withdraw from multiple funders accounts", async function() {
        //send the amount through multiple accounts
        const accounts = await ethers.getSigners()
        for (let index = 0; index < 6; index++) {
            const fundMeConnectedContract = await fundMe.connect(
                accounts[index]
            )
            await fundMeConnectedContract.fund({ value: transferedEther })
        }
        const initialBalanceofContract = await fundMe.provider.getBalance(
            fundMe.address
        )
        const initialBalanceofDeployer = await fundMe.provider.getBalance(
            deployer
        )

        const transactionResponse = await fundMe.optimizedwithdraw()

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
            initialBalanceofContract.add(initialBalanceofDeployer).toString(),
            finalBalanceofDeployer.add(gasUsedCost).toString()
        )
        //check the funders array is reseted or not
        await expect(fundMe.getFunder(0)).to.be.reverted

        //check the mapping of address -> amount , amount is zero of each funders
        for (let index = 0; index < 6; index++) {
            assert(fundMe.getaddressToAmountFunded(accounts[index]), 0)
        }
    })

    it("allows only the owner to withdraw the amount", async function() {
        const accounts = await ethers.getSigners()
        const attacker = accounts[1]
        const attackerConnectedToContract = await fundMe.connect(attacker)
        await expect(attackerConnectedToContract.optimizedwithdraw()).to.be
            .reverted
    })
})
