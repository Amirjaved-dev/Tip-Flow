import { ethers } from "hardhat";

async function main() {
  const txHash = "0xe3a7b8cb22d3bb21fc4427c99a4b4544f4c36932e5e94d402c166a8917b70971";
  const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");

  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt || receipt.status !== 1) {
    console.log(JSON.stringify({ error: "Tx failed or not found" }));
    return;
  }

  const logs = [];
  for (const log of receipt.logs) {
    if (log.topics.length === 4) {
      try {
        const recipient = ethers.getAddress(ethers.dataSlice(log.topics[1], 12));
        const tipper = ethers.getAddress(ethers.dataSlice(log.topics[2], 12));
        const amount = ethers.formatUnits(BigInt(log.data), 6);
        logs.push({ type: "TipReceived", recipient, tipper, amount });
      } catch {}
    }
  }
  console.log(JSON.stringify(logs, null, 2));
}

main().catch(() => process.exit(1));
