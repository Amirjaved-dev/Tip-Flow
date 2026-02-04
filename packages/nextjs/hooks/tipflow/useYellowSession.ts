import { useState } from "react";
import { encodePacked, hashMessage, keccak256, parseEther, parseUnits, toBytes, toHex, decodeEventLog, erc20Abi } from "viem";
import { useAccount, useWalletClient, usePublicClient, useWriteContract, useReadContract } from "wagmi";
import { useDeployedContractInfo, useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export type Campaign = {
  id: string;
  creator: string;
  totalAmount: string;
  remainingAmount: string;
  tips: Record<string, string>; // recipient -> amount
};

export const useYellowSession = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [tips, setTips] = useState<Record<string, bigint>>({});
  const [totalDeposited, setTotalDeposited] = useState<bigint>(0n);

  const { data: tipFlowSessionData } = useDeployedContractInfo("TipFlowSession");
  const { writeContractAsync: createSessionWrite } = useScaffoldWriteContract({ contractName: "TipFlowSession" });
  const { writeContractAsync: settleSessionWrite } = useScaffoldWriteContract({ contractName: "TipFlowSession" });

  const { data: usdcTokenAddress } = useScaffoldReadContract({
    contractName: "TipFlowSession",
    functionName: "usdcToken",
  });

  const { writeContractAsync: writeContract } = useWriteContract();

  /* 
  const { data: decimals } = useScaffoldReadContract({
    contractName: "TipFlowSession",
    functionName: "decimals", 
  }); 
  */

  const { data: tokenDecimals } = useReadContract({
    address: usdcTokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
  });

  const publicClient = usePublicClient();

  const createSession = async (amount: string) => {
    if (!amount || !tipFlowSessionData || !publicClient || !usdcTokenAddress || tokenDecimals === undefined) return;
    try {
      const amountWei = parseUnits(amount, tokenDecimals);

      // Approve first
      const approvalTxHash = await writeContract({
        address: usdcTokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [tipFlowSessionData.address, amountWei],
      });

      if (approvalTxHash) {
        notification.info("Approving USDC...");
        await publicClient.waitForTransactionReceipt({ hash: approvalTxHash });
        notification.success("USDC Approved");
      }

      // Call createSession
      const txHash = await createSessionWrite({
        functionName: "createSession",
        args: [amountWei],
      });

      if (txHash) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

        // Find SessionCreated event
        // Event signature: SessionCreated(bytes32 indexed sessionId, address indexed creator, uint256 amount)
        const eventTopic = keccak256(toHex("SessionCreated(bytes32,address,uint256)"));

        for (const log of receipt.logs) {
          if (log.topics[0] === eventTopic) {
            const parsedSessionId = log.topics[1]; // indexed sessionId is the 1st topic (after event topic)
            if (parsedSessionId) {
              setSessionId(parsedSessionId);
              setTotalDeposited(amountWei);
              notification.success("Session Created & Active!");
              return;
            }
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
    const current = tips[recipient] || 0n;
    // Check limits
    const totalTipped = Object.values(tips).reduce((a, b) => a + b, 0n) + amountWei;
    if (totalTipped > totalDeposited) {
      notification.error("Insufficient session balance!");
      return;
    }

    setTips({ ...tips, [recipient]: current + amountWei });
    notification.success(`Tipped ${amount} to ${recipient}`);
  };

  const endSession = async () => {
    if (!sessionId) {
      // notification.error("No active session ID tracked");
      // For MVP, we need the user to input or we fetch it.
      // Let's assume we retrieve it or pass it in.
      return;
    }

    try {
      const recipients = Object.keys(tips);
      const amounts = recipients.map(r => tips[r]);

      // Construct hash
      // bytes32 messageHash = keccak256(abi.encodePacked(_sessionId, _recipients, _amounts));
      // We need to replicate packing exactly.
      // viem's encodePacked: ['bytes32', 'address[]', 'uint256[]']

      const packed = encodePacked(
        ["bytes32", "address[]", "uint256[]"],
        [sessionId as `0x${string}`, recipients as `0x${string}`[], amounts],
      );
      const messageHash = keccak256(packed);

      // Sign
      const signature = await walletClient?.signMessage({
        message: { raw: toBytes(messageHash) }, // Sign the hash (or raw bytes)? Contract uses toEthSignedMessageHash.
        // signMessage in viem automatically adds prefix for string/bytes.
        // If we pass raw bytes, it adds prefix.
        // Contract: messageHash.toEthSignedMessageHash().recover(signature)
        // So we should sign the raw bytes of the keccak hash.
      });

      if (!signature) return;

      await settleSessionWrite({
        functionName: "settleSession",
        args: [sessionId as `0x${string}`, recipients, amounts, signature],
      });

      setTips({});
      setSessionId(null);
      notification.success("Session Settled!");
    } catch (e) {
      console.error(e);
      notification.error("Settlement failed");
    }
  };

  return {
    sessionId,
    setSessionId, // Allow setting manually for MVP if needed
    tips,
    addTip,
    createSession,
    endSession,
    totalDeposited,
  };
};
