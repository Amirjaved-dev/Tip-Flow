"use client";

import { useEffect } from "react";
import { useSafeLocalStorage as useLocalStorage } from "./useSafeLocalStorage";
import { useSmartAccount } from "./useSmartAccount";
import {
  concat,
  encodeAbiParameters,
  erc20Abi,
  formatUnits,
  getAddress,
  keccak256,
  parseUnits,
  toBytes,
  toHex,
} from "viem";
import { encodeFunctionData } from "viem";
import { sepolia } from "viem/chains";
import { usePublicClient, useReadContract, useWalletClient } from "wagmi";
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
  const { smartAccountClient, smartAccountAddress } = useSmartAccount();
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
      stateMutability: "view",
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

    if (!walletClient || !walletClient.account) {
      notification.error("Please connect your wallet");
      return;
    }

    try {
      const amountWei = parseUnits(amount, tokenDecimals);
      const eoaAddress = walletClient.account.address;
      const saAddress = smartAccountAddress;

      if (!eoaAddress) {
        notification.error("Wallet address invalid.");
        return;
      }

      // Check Balances
      const saBalance = saAddress
        ? await publicClient.readContract({
            address: usdcTokenAddress,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [saAddress as `0x${string}`],
          })
        : 0n;

      const eoaBalance = await publicClient.readContract({
        address: usdcTokenAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [eoaAddress],
      });

      const totalAvailable = saBalance + eoaBalance;

      if (totalAvailable < amountWei) {
        notification.error(
          `Insufficient USDC balance. You have ${formatUnits(totalAvailable, tokenDecimals)} USDC total (Wallet: ${formatUnits(eoaBalance, tokenDecimals)}, Smart Account: ${formatUnits(saBalance, tokenDecimals)}) but need ${amount} USDC`,
        );
        return;
      }

      notification.info("Creating Session...");

      console.log("Starting createSession...");
      console.log("WalletClient:", !!walletClient);
      console.log("SmartAccountClient:", !!smartAccountClient);
      console.log("SA Address:", saAddress);

      // Choose whether to use Smart Account (gasless) or regular wallet
      let txHash;
      if (smartAccountClient && saAddress) {
        notification.info("Sponsoring transaction with Pimlico...");

        const transactions: any[] = [];

        // If we need more funds in the Smart Account, pull from EOA via Permit
        if (saBalance < amountWei) {
          notification.info("Funds are in your main wallet. Requesting Permit signature...");

          const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now
          const nonce = await publicClient.readContract({
            address: usdcTokenAddress as `0x${string}`,
            abi: usdcAbi,
            functionName: "nonces",
            args: [eoaAddress],
          });

          const domain = {
            name: "USDC",
            version: "2",
            chainId: BigInt(sepolia.id),
            verifyingContract: usdcTokenAddress as `0x${string}`,
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

          const signature = await walletClient.signTypedData({
            account: eoaAddress,
            domain,
            types,
            primaryType: "Permit",
            message: {
              owner: eoaAddress,
              spender: saAddress as `0x${string}`,
              value: amountWei,
              nonce,
              deadline,
            },
          });

          const { r, s, v } = await import("viem").then(m => m.parseSignature(signature));

          // 1. Permit
          transactions.push({
            to: getAddress(usdcTokenAddress as string),
            data: encodeFunctionData({
              abi: usdcAbi,
              functionName: "permit",
              args: [getAddress(eoaAddress), getAddress(saAddress as string), amountWei, deadline, Number(v), r, s],
            }),
          });

          // 2. TransferFrom EOA to SA
          transactions.push({
            to: getAddress(usdcTokenAddress as string),
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: "transferFrom",
              args: [getAddress(eoaAddress), getAddress(saAddress as string), amountWei],
            }),
          });
        }

        // 3. Approve Session Contract (from SA)
        transactions.push({
          to: getAddress(usdcTokenAddress as string),
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: "approve",
            args: [getAddress(tipFlowSessionData.address), amountWei],
          }),
        });

        // 4. Create Session (from SA)
        transactions.push({
          to: getAddress(tipFlowSessionData.address),
          data: encodeFunctionData({
            abi: tipFlowSessionData.abi,
            functionName: "createSession",
            args: [amountWei],
          }),
        });

        console.log("Sending batches transactions:", transactions);

        // Ensure all 'to' fields are valid addresses
        transactions.forEach((tx, i) => {
          if (!tx.to) throw new Error(`Transaction ${i} is missing 'to' address`);
        });

        txHash = await smartAccountClient.sendTransaction({
          calls: transactions,
        });
      } else {
        // Fallback to regular wallet (EOA)
        notification.info("Using regular wallet...");
        const { request: approveRequest } = await publicClient.simulateContract({
          address: usdcTokenAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [tipFlowSessionData.address, amountWei],
          account: eoaAddress,
        });

        const approveHash = await walletClient.writeContract(approveRequest);
        await publicClient.waitForTransactionReceipt({ hash: approveHash });

        const { request: createSessionRequest } = await publicClient.simulateContract({
          address: tipFlowSessionData.address,
          abi: tipFlowSessionData.abi,
          functionName: "createSession",
          args: [amountWei],
          account: eoaAddress,
        });

        txHash = await walletClient.writeContract(createSessionRequest);
      }

      notification.info(`Transaction sent: ${txHash}`);

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
            notification.success("Session Created!");
            return;
          }
        }
      }
    } catch (e) {
      console.error(e);
      notification.error("Failed to create session");
    }
  };

  const addTip = (recipient: string, amount: string, recipientName?: string) => {
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

    // Check if recipientName is "Tip Address" (case-insensitive) to avoid redundancy
    const displayName = recipientName && recipientName.toLowerCase() !== "tip address" ? recipientName : recipient;

    notification.success(`Tipped ${amount} to ${displayName}`);
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
    if (!sessionId || !tipFlowSessionData) {
      return;
    }

    if (!walletClient || !walletClient.account) {
      notification.error("Wallet not connected");
      return;
    }

    try {
      const recipients = Object.keys(tips);

      // Validate all addresses before attempting to encode
      const { isAddress } = await import("viem");
      const invalidAddresses = recipients.filter(addr => !isAddress(addr));

      if (invalidAddresses.length > 0) {
        notification.error(`Invalid addresses found in session. Clearing session data. Please start a new session.`);
        console.error("Invalid addresses:", invalidAddresses);
        setSessionId(null);
        setTips({});
        setTotalDeposited("0");
        return;
      }

      // Convert stored strings back to bigints for signing/contract call
      const amounts = recipients.map(r => BigInt(tips[r]));

      // Generate the message hash that matches the contract's verification
      // Contract does: keccak256(abi.encodePacked(_sessionId, _recipients, _amounts))
      // Then verifies with: messageHash.toEthSignedMessageHash().recover(_signature)

      const { encodePacked } = await import("viem");

      // We need to use encodePacked equivalent in viem
      // encodePacked concatenates values without padding
      const messageHash = keccak256(
        encodePacked(
          ["bytes32", "address[]", "uint256[]"],
          [sessionId as `0x${string}`, recipients as `0x${string}`[], amounts],
        ),
      );

      console.log("Frontend Session ID:", sessionId);
      console.log("Frontend Message Hash:", messageHash);

      // Sign the message
      notification.info("Please sign the settlement message...");
      let signature: `0x${string}`;

      // For Safe's isValidSignature, we need to sign the Safe-specific message hash
      // Safe computes: keccak256(0x19, 0x01, domainSeparator, keccak256(abi.encode(messageHash)))
      // Then for eth_sign: wraps with "\x19Ethereum Signed Message:\n32" prefix
      if (smartAccountClient && smartAccountAddress) {
        const {
          encodeAbiParameters,
          hexToBytes,
          bytesToHex,
          parseSignature,
          concat: viemConcat,
        } = await import("viem");

        // Get Safe's domain separator
        const SAFE_DOMAIN_SEPARATOR_ABI = [
          {
            name: "domainSeparator",
            type: "function",
            inputs: [],
            outputs: [{ type: "bytes32" }],
            stateMutability: "view",
          },
        ] as const;

        const domainSeparator = await publicClient!.readContract({
          address: smartAccountAddress as `0x${string}`,
          abi: SAFE_DOMAIN_SEPARATOR_ABI,
          functionName: "domainSeparator",
        });

        console.log("Safe Domain Separator:", domainSeparator);

        // Compute Safe's message hash
        // SafeMessage type hash: keccak256("SafeMessage(bytes message)")
        const SAFE_MSG_TYPEHASH = keccak256(toHex("SafeMessage(bytes message)"));

        // The data passed to Safe is abi.encode(messageHash)
        const encodedMessageHash = encodeAbiParameters([{ type: "bytes32" }], [messageHash as `0x${string}`]);

        // Safe's getMessageHash: keccak256(0x19 0x01 domainSeparator keccak256(abi.encode(SAFE_MSG_TYPEHASH, keccak256(message))))
        const messageDataHash = keccak256(encodedMessageHash);
        const safeMessageHash = keccak256(
          encodeAbiParameters([{ type: "bytes32" }, { type: "bytes32" }], [SAFE_MSG_TYPEHASH, messageDataHash]),
        );

        // Final hash with EIP-712 prefix
        const finalSafeHash = keccak256(
          viemConcat([toHex(new Uint8Array([0x19, 0x01])), domainSeparator as `0x${string}`, safeMessageHash]),
        );

        console.log("Safe Message Hash to sign:", finalSafeHash);

        // Sign using signMessage which adds eth_sign prefix
        const rawSignature = await walletClient.signMessage({
          message: { raw: hexToBytes(finalSafeHash) },
        });

        // Adjust v for Safe's eth_sign format (v + 4)
        const { r, s, v } = parseSignature(rawSignature);
        const adjustedV = Number(v) + 4;
        signature = bytesToHex(
          new Uint8Array([...hexToBytes(r as `0x${string}`), ...hexToBytes(s as `0x${string}`), adjustedV]),
        );
        console.log("Adjusted signature for Safe:", signature);
      } else {
        // For EOA, sign the messageHash directly (with eth prefix)
        signature = await walletClient.signMessage({
          message: { raw: toBytes(messageHash) },
        });
      }

      // Now call settleSession with the signature
      let txHash;
      const checksummedRecipients = recipients.map(r => getAddress(r));

      if (smartAccountClient) {
        notification.info("Sponsoring settlement with Pimlico...");
        txHash = await smartAccountClient.sendTransaction({
          calls: [
            {
              to: getAddress(tipFlowSessionData.address),
              data: encodeFunctionData({
                abi: tipFlowSessionData.abi,
                functionName: "settleSession",
                args: [sessionId as `0x${string}`, checksummedRecipients, amounts, signature],
              }),
            },
          ],
        });
      } else {
        const { request: settleRequest } = await publicClient!.simulateContract({
          address: tipFlowSessionData.address,
          abi: tipFlowSessionData.abi,
          functionName: "settleSession",
          args: [sessionId as `0x${string}`, checksummedRecipients, amounts, signature],
          account: walletClient.account.address,
        });

        txHash = await walletClient.writeContract(settleRequest);
      }

      notification.info(`Settlement transaction sent: ${txHash}`);
      await publicClient?.waitForTransactionReceipt({ hash: txHash });

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
    if (!tipFlowSessionData) {
      return;
    }
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
