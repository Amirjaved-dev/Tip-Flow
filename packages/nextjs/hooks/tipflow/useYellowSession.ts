"use client";

import { useEffect } from "react";
import { useSmartAccount } from "./useSmartAccount";
import { useLocalStorage } from "usehooks-ts";
import { erc20Abi, formatUnits, keccak256, parseUnits, toHex } from "viem";
import { encodeFunctionData } from "viem";
import { sepolia } from "viem/chains";
import { usePublicClient, useReadContract, useWalletClient, useWriteContract } from "wagmi";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export type Campaign = {
  id: string;
  creator: string;
  totalAmount: string;
  remainingAmount: string;
  tips: Record<string, string>; // recipient -> amount
};

export const useYellowSession = () => {
  const { smartAccountClient } = useSmartAccount();
  const { data: walletClient } = useWalletClient();

  // Persist session state
  const [sessionId, setSessionId] = useLocalStorage<string | null>("tipflow-sessionId", null);
  // Store amounts as strings to avoid BigInt serialization issues in localStorage
  const [tips, setTips] = useLocalStorage<Record<string, string>>("tipflow-tips", {});
  const [totalDeposited, setTotalDeposited] = useLocalStorage<string>("tipflow-totalDeposited", "0");

  const { data: tipFlowSessionData } = useDeployedContractInfo({ contractName: "TipFlowSession" });
  // We keep read hooks for reading state
  const { writeContractAsync: withdrawWrite } = useScaffoldWriteContract({ contractName: "TipFlowSession" });

  const { data: usdcTokenAddress } = useScaffoldReadContract({
    contractName: "TipFlowSession",
    functionName: "usdcToken",
  });

  const { data: tokenDecimals } = useReadContract({
    address: usdcTokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
  });

  const publicClient = usePublicClient();

  // Extended ABI for USDC (Permit + Nonces)
  const usdcAbi = [
    ...erc20Abi,
    {
      inputs: [{ name: "owner", type: "address" }],
      name: "nonces",
      outputs: [{ name: "uint256", type: "uint256" }],
      stateMetrics: "view",
      type: "function",
    },
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
      inputs: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "deadline", type: "uint256" },
        { name: "v", type: "uint8" },
        { name: "r", type: "bytes32" },
        { name: "s", type: "bytes32" },
      ],
      name: "permit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const;

  const createSession = async (amount: string) => {
    if (!amount || !tipFlowSessionData || !publicClient || !usdcTokenAddress || tokenDecimals === undefined) return;

    if (!smartAccountClient) {
      notification.error("Smart Account not ready. Please wait...");
      return;
    }

    try {
      const amountWei = parseUnits(amount, tokenDecimals);
      const smartAccountAddress = smartAccountClient.account.address;

      if (!smartAccountAddress || smartAccountAddress === "0x0000000000000000000000000000000000000000") {
        notification.error("Smart Account address invalid.");
        return;
      }

      // Check Smart Account Balance
      const balance = await publicClient.readContract({
        address: usdcTokenAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [smartAccountAddress],
      });

      const calls = [];

      // If Smart Account needs funds, pull from EOA via Permit
      if (balance < amountWei) {
        const missing = amountWei - balance;
        console.log(`Smart Account needs ${formatUnits(missing, tokenDecimals)} USDC. Initiating Permit...`);

        if (!walletClient || !walletClient.account) {
          notification.error("Wallet not connected");
          return;
        }

        const eoaAddress = walletClient.account.address;

        // 1. Get Nonce
        const nonce = await publicClient.readContract({
          address: usdcTokenAddress,
          abi: usdcAbi,
          functionName: "nonces",
          args: [eoaAddress],
        });

        // 2. Define Permit
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour
        const domain = {
          name: "USDC", // Standard USDC name on Sepolia
          version: "2", // Standard USDC version on Sepolia
          chainId: sepolia.id,
          verifyingContract: usdcTokenAddress,
        };
        const types = {
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        };

        // 3. Sign Permit (No Gas)
        notification.info("Please sign the Gasless Permit in your wallet...");

        const signature = await walletClient.signTypedData({
          domain,
          types,
          primaryType: "Permit",
          message: {
            owner: eoaAddress,
            spender: smartAccountAddress,
            value: missing,
            nonce: nonce,
            deadline: deadline,
          },
        });

        // Split Signature (r, s, v)
        // viem signature is hex string, needed to split?
        // Actually permit function takes v, r, s.
        // We can use viem's parseSignature? No need, manual slice works or viem utils.
        const { r, s, v } = await import("viem").then(m => m.parseSignature(signature));

        let vNum = Number(v);
        // Normalize 0/1 to 27/28 if needed by EIP-2612
        if (vNum === 0 || vNum === 1) {
          vNum += 27;
        }

        console.log("Splitting Signature:", { signature, v, vNum, r, s });

        // 4. Batch: Permit Call
        const permitData = encodeFunctionData({
          abi: usdcAbi,
          functionName: "permit",
          args: [eoaAddress, smartAccountAddress, missing, deadline, vNum, r, s],
        });

        calls.push({
          to: usdcTokenAddress,
          data: permitData,
          value: 0n,
        });

        // 5. Batch: TransferFrom Call (Pull funds)
        const transferFromData = encodeFunctionData({
          abi: erc20Abi, // standard erc20 has transferFrom
          functionName: "transferFrom",
          args: [eoaAddress, smartAccountAddress, missing],
        });

        calls.push({
          to: usdcTokenAddress,
          data: transferFromData,
          value: 0n,
        });
      }

      notification.info("Initializing Session...");

      // 6. Approve Session Contract
      const approveData = encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [tipFlowSessionData.address, amountWei],
      });
      calls.push({
        to: usdcTokenAddress,
        data: approveData,
        value: 0n,
      });

      // 7. Create Session
      const createSessionData = encodeFunctionData({
        abi: tipFlowSessionData.abi,
        functionName: "createSession",
        args: [amountWei],
      });
      calls.push({
        to: tipFlowSessionData.address,
        data: createSessionData,
        value: 0n,
      });

      // Execute Batch
      const txHash = await smartAccountClient.sendTransaction({ calls });

      notification.info(`UserOp sent: ${txHash}`);

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

      // Find SessionCreated event
      const eventTopic = keccak256(toHex("SessionCreated(bytes32,address,uint256)"));

      for (const log of receipt.logs) {
        if (log.topics[0] === eventTopic) {
          const parsedSessionId = log.topics[1];
          if (parsedSessionId) {
            setSessionId(parsedSessionId);
            setTotalDeposited(amountWei.toString());
            setTips({}); // Clear any old tips
            notification.success("Session Created (Gasless)!");
            return;
          }
        }
      }
    } catch (e) {
      console.error(e);
      notification.error("Failed to create session");
    }
  };

  const addTip = (recipient: string, amount: string) => {
    if (tokenDecimals === undefined) return;
    const amountWei = parseUnits(amount, tokenDecimals);

    // Parse current tips from string to bigint
    const currentTipsBigInt: Record<string, bigint> = {};
    Object.entries(tips).forEach(([k, v]) => {
      currentTipsBigInt[k] = BigInt(v);
    });

    const currentRecipientAmount = currentTipsBigInt[recipient] || 0n;

    // Check limits
    const totalTipped = Object.values(currentTipsBigInt).reduce((a, b) => a + b, 0n) + amountWei;

    if (totalTipped > BigInt(totalDeposited)) {
      notification.error("Insufficient session balance!");
      return;
    }

    // Save back as string
    const newAmount = currentRecipientAmount + amountWei;
    setTips({ ...tips, [recipient]: newAmount.toString() });
    notification.success(`Tipped ${amount} to ${recipient}`);
  };

  // Validate session on-chain to handle chain resets or desyncs
  const { data: sessionInfo } = useScaffoldReadContract({
    contractName: "TipFlowSession",
    functionName: "sessions",
    args: [
      sessionId ? (sessionId as `0x${string}`) : "0x0000000000000000000000000000000000000000000000000000000000000000",
    ],
    watch: true,
    query: {
      enabled: !!sessionId,
    },
  });

  useEffect(() => {
    // If we have a local session ID but the chain says it's inactive or doesn't exist (creator == 0),
    // we should clear the local state to prevent "Session not active" errors.
    if (sessionId && sessionInfo) {
      const [creator, , isActive] = sessionInfo;
      // If inactive OR creator is zero address (implies chain reset/doesn't exist)
      if (!isActive || creator === "0x0000000000000000000000000000000000000000") {
        console.log("Session invalid or inactive on-chain. Clearing local state.");
        setSessionId(null);
        setTips({});
        setTotalDeposited("0");
      }
    }
  }, [sessionId, sessionInfo, setSessionId, setTips, setTotalDeposited]);

  const endSession = async () => {
    if (!sessionId) {
      return;
    }

    try {
      const recipients = Object.keys(tips);
      // Convert stored strings back to bigints for signing/contract call
      const amounts = recipients.map(r => BigInt(tips[r]));

      if (smartAccountClient) {
        // Construct transaction for Smart Account
        const settleData = encodeFunctionData({
          abi: tipFlowSessionData.abi,
          functionName: "settleSession",
          args: [sessionId as `0x${string}`, recipients, amounts, "0x"], // "0x" is fine now as creator is msg.sender
        });

        const txHash = await smartAccountClient.sendTransaction({
          to: tipFlowSessionData.address,
          data: settleData,
          value: 0n,
        });

        notification.info(`Settlement UserOp sent: ${txHash}`);
        await publicClient?.waitForTransactionReceipt({ hash: txHash });
      } else {
        // Fallback or Error
        notification.error("Smart Account not ready for settlement");
        return;
      }

      setTips({});
      setSessionId(null);
      setTotalDeposited("0");
      notification.success("Session Settled!");
    } catch (e: any) {
      console.error(e);
      // Handle the specific "Session is not active" error
      if (e.message && (e.message.includes("Session is not active") || e.message.includes("Session not active"))) {
        notification.error("Session no longer active on-chain. Clearing local state.");
        setSessionId(null);
        setTips({});
        setTotalDeposited("0");
      } else {
        notification.error("Settlement failed");
      }
    }
  };

  const withdraw = async () => {
    try {
      await withdrawWrite({
        functionName: "withdraw",
      });
      notification.success("Funds withdrawn successfully!");
    } catch (e) {
      console.error(e);
      notification.error("Withdraw failed");
    }
  };

  // Convert internal string state to BigInts for consumers if they expect BigInt
  // But wait, page.tsx expects bigint in 'tips'.
  const tipsBigInt: Record<string, bigint> = {};
  Object.entries(tips).forEach(([k, v]) => {
    tipsBigInt[k] = BigInt(v);
  });

  return {
    sessionId,
    setSessionId,
    tips: tipsBigInt, // Return BigInt version to maintain API compatibility
    addTip,
    createSession,
    endSession,
    withdraw, // Expose withdraw function
    totalDeposited: BigInt(totalDeposited), // Return BigInt version
    tokenDecimals,
  };
};
