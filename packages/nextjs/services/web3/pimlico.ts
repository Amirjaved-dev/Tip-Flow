import { createPimlicoClient } from "permissionless/clients/pimlico";
import { http } from "viem";
import { entryPoint07Address } from "viem/account-abstraction";
import { sepolia } from "viem/chains";

const PIMLICO_API_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
const PIMLICO_RPC_URL = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${PIMLICO_API_KEY}`;

if (!PIMLICO_API_KEY) {
    console.warn("NEXT_PUBLIC_PIMLICO_API_KEY is not set. Pimlico Paymaster will not work.");
}

export const paymasterClient = createPimlicoClient({
    transport: http(PIMLICO_RPC_URL),
    entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
    },
});
