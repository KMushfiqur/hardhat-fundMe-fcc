// function deployfunc() {
//     console.log("hi");
// }

const { network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
// module.exports.default = deployfunc
const { developmentChains } = require("../helper-hardhat-config")
const { log } = require("console")
const { verify } = require("../utils/verify")


module.exports = async (hre) => {
    console.log("Running on network:", network.name)
    const { getNamedAccounts, deployments } = hre
    const { deploy, logs } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId


    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    //the idea of mock contract , if the contract doesnt exist we deploy a minimum version of it 
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        log: true,
        args: args, // put priceFeed Address 
        waitConfirmations: network.config.blockConfirmations || 1
    })
    log("____________________________")


    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying contract at", fundMe.address)
        await verify(fundMe.address, args)
    }
}

module.exports.tags = ["all", "fundMe"]