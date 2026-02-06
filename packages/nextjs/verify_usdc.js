const { createPublicClient, http, parseAbi } = require('viem');
const { sepolia } = require('viem/chains');

// Default key from scaffold.config.ts
const client = createPublicClient({
    chain: sepolia,
    transport: http("https://eth-sepolia.g.alchemy.com/v2/cR4WnXePioePZ5fFrnSiR")
});

const contractAddress = "0x34A1cA793F159497c988B7f3e68050e7cAeAb825";

async function main() {
    try {
        const usdc = await client.readContract({
            address: contractAddress,
            abi: parseAbi(['function usdcToken() view returns (address)']),
            functionName: 'usdcToken',
        });
        console.log("USDC Token Address on Contract:", usdc);
    } catch (error) {
        console.error("Error reading contract:", error);
    }
}

main();
