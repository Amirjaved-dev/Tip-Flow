"use client";
import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import { createSmartAccountClient } from "permissionless";
import { toSimpleSmartAccount } from "permissionless/accounts";
import { toOwner } from "permissionless/utils";
import { createPublicClient, http } from "viem";
import { entryPoint07Address } from "viem/account-abstraction";
import { sepolia } from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";
import { paymasterClient } from "~~/services/web3/pimlico";

export const useSmartAccount = () => {
    const { data: walletClient } = useWalletClient();
    const [smartAccountClient, setSmartAccountClient] = useState<any | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const initSmartAccount = async () => {
            if (!walletClient || !walletClient.account) {
                setSmartAccountClient(null);
                setIsReady(false);
                return;
            }

            try {
                const chain = sepolia;

                // 1. Public Client
                // 1. Public Client
                // Use a reliable public RPC that doesn't require auth (or rely on scaffold config)
                const publicClient = createPublicClient({
                    chain,
                    transport: http("https://ethereum-sepolia-rpc.publicnode.com"),
                });

                // 2. Create the Simple Smart Account
                // Permissionless.js 0.1.x - 0.3.x style
                const owner = await toOwner({ owner: walletClient });

                const simpleAccount = await toSimpleSmartAccount({
                    client: publicClient,
                    owner: owner as any,
                    factoryAddress: "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985", // SimpleAccountFactory v0.7
                    entryPoint: {
                        address: entryPoint07Address,
                        version: "0.7",
                    },
                });

                if (!simpleAccount.address || simpleAccount.address === "0x0000000000000000000000000000000000000000") {
                    throw new Error("Failed to generate Smart Account Address (returned 0x0). Check RPC or Factory.");
                }

                // 3. Pimlico Setup
                const pimlicoApiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
                const bundlerUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${pimlicoApiKey}`;

                // 4. Create Smart Account Client
                const client = createSmartAccountClient({
                    account: simpleAccount,
                    chain,
                    bundlerTransport: http(bundlerUrl),
                    paymaster: paymasterClient,
                    userOperation: {
                        estimateFeesPerGas: async () => {
                            return (await paymasterClient.getUserOperationGasPrice()).fast;
                        },
                    },
                });

                console.log("Smart Account Initialized:", {
                    address: simpleAccount.address,
                    bundlerUrl: bundlerUrl,
                    paymaster: !!paymasterClient
                });

                setSmartAccountClient(client);
                setIsReady(true);
            } catch (e) {
                console.error("Error setting up smart account:", e);
                setIsReady(false);
            }
        };

        if (walletClient) initSmartAccount();
    }, [walletClient]);

    return { smartAccountClient, isReady };
};
