import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { parseEther } from "ethers";

/**
 * Deploys the TipFlowSession contract.
 * If on localhost/hardhat network, it also deploys a Mock USDC.
 */
const deployTipFlow: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Check if we are on a local network
  const network = await hre.getChainId(); // 31337 is hardhat

  let usdcAddress;

  // For testing/local, deploy a mock token first if not exists (or just use one)
  // But usually, we might want to deploy a specialized mock for this
  // Let's check if we can deploy a "MockUSDC"
  if (network === "31337") {
    console.log("Local network detected! Deploying MockUSDC...");
    // We will reuse YourContract as a simple "token" or deploy an ERC20Mock if available?
    // Since we don't have a standard ERC20Mock file, let's deploy a standard OE ERC20 if possible or
    // creates a quick Mock inside contracts (I should create one first really).
    // For now, let's assume I will create a MockUSDC.sol

    const mockDeploy = await deploy("MockUSDC", {
      from: deployer,
      args: ["Mock USDC", "USDC", parseEther("1000000")], // 1M initial supply
      log: true,
      autoMine: true,
    });
    usdcAddress = mockDeploy.address;
  } else {
    // Sepolia USDC Address (Circle)
    // https://faucet.circle.com/
    usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
    console.log("Using Sepolia USDC verified address:", usdcAddress);
  }

  // Platform wallet for 1% fees
  const platformWallet = "0x78c5FEb77d691697532741594189DcDAbb69da87";

  await deploy("TipFlowSession", {
    from: deployer,
    // Contract constructor arguments
    args: [usdcAddress, platformWallet],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const tipFlowSession = await hre.ethers.getContract("TipFlowSession", deployer);
  console.log("👋 TipFlowSession deployed to:", await tipFlowSession.getAddress());
  console.log("Using USDC:", usdcAddress);
};

export default deployTipFlow;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags TipFlowSession
deployTipFlow.tags = ["TipFlowSession"];
