const { assert } = require("chai")
const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe
          let deployer
          const transferedEther = ethers.utils.parseEther("0.001")

          beforeEach(async () => {
              //deploy the contract
              deployer = (await getNamedAccounts()).deployer
              // await deployments.fixture(["all"]) //in staging test we assume that the contract is deployed to test net and no need of MOCKAVI also
              fundMe = await ethers.getContract("FundMe", deployer)
          })
          it("fund and transfer the ether to and from the account", async function() {
              await fundMe.fund({ value: transferedEther })
              await fundMe.optimizedwithdraw()

              const finalAmountInContract = await fundMe.provider.getBalance(
                  fundMe.address
              )
              assert.equal(finalAmountInContract.toString(), "0")
          })
      })
