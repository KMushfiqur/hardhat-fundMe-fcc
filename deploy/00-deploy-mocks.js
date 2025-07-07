// function deployfunc() {
//     console.log("hi");
// }

const { network } = require("hardhat")
// module.exports.default = deployfunc

const { networkConfig, DECIMALS, INITIAL_ANSWERS } = require("../helper-hardhat-config")
// module.exports.default = deployfunc
const { developmentChains } = require("../helper-hardhat-config")


module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, logs } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        console.log("local network detected")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWERS]

        })
        console.log("Mocks deployed")
        console.log("_______________________________")
    }
}

module.exports.tags = ["all", "mocks"]