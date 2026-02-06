
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

const publicClient = createPublicClient({
    chain: sepolia,
    transport: http("https://ethereum-sepolia-rpc.publicnode.com"),
});

const abi = [
    {
        inputs: [],
        name: "name",
        outputs: [{ name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "version",
        outputs: [{ name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "DOMAIN_SEPARATOR",
        outputs: [{ name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    }
] as const;

async function main() {
    console.log("Checking USDC Details on Sepolia...");
    try {
        const name = await publicClient.readContract({
            address: usdcAddress,
            abi: abi,
            functionName: "name",
        });
        console.log("Name:", name);

        const version = await publicClient.readContract({
            address: usdcAddress,
            abi: abi,
            functionName: "version",
        });
        console.log("Version:", version);

        // EIP-2612 usually exposes DOMAIN_SEPARATOR.
        const onChainDomainSeparator = await publicClient.readContract({
            address: usdcAddress,
            abi: abi,
            functionName: "DOMAIN_SEPARATOR",
        });
        console.log("On-Chain Domain Separator:", onChainDomainSeparator);

        // Calculate locally to verify
        const { keccak256, encodeAbiParameters, parseAbiParameters, toHex, stringToBytes } = await import("viem");

        // EIP-712 Domain Separator construction
        // keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")
        const DOMAIN_TYPEHASH = keccak256(toHex("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"));

        const computedDomainSeparator = keccak256(
            encodeAbiParameters(
                parseAbiParameters("bytes32, bytes32, bytes32, uint256, address"),
                [
                    DOMAIN_TYPEHASH,
                    keccak256(toHex(name as string)),
                    keccak256(toHex(version as string)),
                    BigInt(sepolia.id),
                    usdcAddress
                ]
            )
        );
        console.log("Computed Domain Separator:", computedDomainSeparator);

        if (onChainDomainSeparator === computedDomainSeparator) {
            console.log("SUCCESS: Domain Separator Matches!");
        } else {
            console.error("FAILURE: Domain Separator Mismatch!");
            console.error("Check Name, Version, ChainID, or Contract Address.");
        }

    } catch (e) {
        console.error("Error fetching details:", e);
    }
}

main();
