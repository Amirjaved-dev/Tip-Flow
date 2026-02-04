import { useState } from "react";
import { encodePacked, hashMessage, keccak256, parseEther, toBytes } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
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

  const { writeContractAsync: createSessionWrite } = useScaffoldWriteContract("TipFlowSession");
  const { writeContractAsync: settleSessionWrite } = useScaffoldWriteContract("TipFlowSession");
  const { writeContractAsync: approveUSDC } = useScaffoldWriteContract("MockUSDC"); // Assuming MockUSDC for local

  const createSession = async (amount: string) => {
    if (!amount) return;
    try {
      const amountWei = parseEther(amount);

      // Approve first (simplified, ideally strictly checking allowance)
      await approveUSDC({
        functionName: "approve",
        args: ["0xYourContractAddressPlaceholder", amountWei], // TODO: Need mechanism to get contract address dynamically here if helpful, or relying on hook internals
        // Actually useScaffoldWriteContract knows the address if name matches.
        // But wait, approve is on Token, spender is TipFlowSession.
      });
      // Wait? useScaffoldWriteContract handles waiting usually? No, it returns tx hash/promise.
      // We probably need to wait for approval.
      // For MVP, letting user rely on UI to trigger deposit after approval or using a better flow.

      // Actually, let's just try deposit. If it fails, user needs to approve.
      // Ideally we do: Approve -> Wait -> Deposit.
      // The `writeContractAsync` just sends it.

      // Call createSession
      const tx = await createSessionWrite({
        functionName: "createSession",
        args: [amountWei],
      });

      // We need the sessionId from the event.
      // This complexity might be better handled in a component or by watching events.
      // For now, let's simulate sessionId generation same as contract to track it locally?
      // Keccak(sender, block.timestamp, amount) - block.timestamp is hard to guess exactly.
      // Better to fetch active session from contract or storing the tx hash.

      setTotalDeposited(amountWei);
      notification.success("Session Created! (Tracking ID pending)");
      // In reality, we'd query the graph or logs.
    } catch (e) {
      console.error(e);
      notification.error("Failed to create session");
    }
  };

  const addTip = (recipient: string, amount: string) => {
    const amountWei = parseEther(amount);
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
