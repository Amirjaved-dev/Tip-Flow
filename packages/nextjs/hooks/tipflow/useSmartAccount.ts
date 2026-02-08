"use client";

import { useEffect, useState } from "react";
import { createSmartAccountClient } from "permissionless";
import { toSafeSmartAccount } from "permissionless/accounts";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { useWalletClient } from "wagmi";

const PIMLICO_API_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
const entryPointAddress = "0x0000000071727De22E5E9d8BAf0edAc6f37da032"; // EntryPoint v0.7

export const useSmartAccount = () => {
  const { data: walletClient } = useWalletClient();
  const [smartAccountClient, setSmartAccountClient] = useState<any>(undefined);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | undefined>(undefined);

  useEffect(() => {
    const initSmartAccount = async () => {
      if (!walletClient || !PIMLICO_API_KEY) return;

      try {
        const publicClient = createPublicClient({
          chain: sepolia,
          transport: http(process.env.NEXT_PUBLIC_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com"),
        });

        const pimlicoClient = createPimlicoClient({
          chain: sepolia,
          transport: http(`https://api.pimlico.io/v2/sepolia/rpc?apikey=${PIMLICO_API_KEY}`),
          entryPoint: {
            address: entryPointAddress,
            version: "0.7",
          },
        });

        const safeAccount = await toSafeSmartAccount({
          client: publicClient,
          owners: [walletClient],
          version: "1.4.1",
          entryPoint: {
            address: entryPointAddress,
            version: "0.7",
          },
        });

        const client = createSmartAccountClient({
          account: safeAccount,
          chain: sepolia,
          bundlerTransport: http(`https://api.pimlico.io/v2/sepolia/rpc?apikey=${PIMLICO_API_KEY}`),
          paymaster: pimlicoClient,
          userOperation: {
            estimateFeesPerGas: async () => {
              return (await pimlicoClient.getUserOperationGasPrice()).fast;
            },
          },
        });

        setSmartAccountClient(client);
        setSmartAccountAddress(safeAccount.address);
      } catch (error) {
        console.error("Error initializing smart account:", error);
      }
    };

    initSmartAccount();
  }, [walletClient]);

  return {
    smartAccountClient,
    smartAccountAddress,
    network: walletClient?.chain,
  };
};
