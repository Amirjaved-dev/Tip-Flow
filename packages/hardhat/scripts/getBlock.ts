import { ethers } from "hardhat";

async function main() {
  const txHash = "0xe3a7b8cb22d3bb21fc4427c99a4b4544f4c36932e5e94d402c166a8917b70971";
  const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");

  const receipt = await provider.getTransactionReceipt(txHash);
  if (receipt) {
    console.log("Block Number:", receipt.blockNumber);
  } else {
    console.log("Receipt not found");
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
