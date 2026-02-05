import { useLocalStorage } from "usehooks-ts";
import { encodePacked, erc20Abi, keccak256, parseUnits, toBytes, toHex } from "viem";
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
  const { data: walletClient } = useWalletClient();

  // Persist session state
  // key: "tipflow-session-{address}" to support multiple wallets?
  // For now "tipflow-session" is fine, or scoped to address if possible.
  // scoped to address is better to avoid data leak if user switches wallet.
  // But hooks rules... we can use a key that ignores address first or just "current-session".
  // Let's use simple keys for MVP.

  const [sessionId, setSessionId] = useLocalStorage<string | null>("tipflow-sessionId", null);
  // Store amounts as strings to avoid BigInt serialization issues in localStorage
  const [tips, setTips] = useLocalStorage<Record<string, string>>("tipflow-tips", {});
  const [totalDeposited, setTotalDeposited] = useLocalStorage<string>("tipflow-totalDeposited", "0");

  const { data: tipFlowSessionData } = useDeployedContractInfo({ contractName: "TipFlowSession" });
  const { writeContractAsync: createSessionWrite } = useScaffoldWriteContract({ contractName: "TipFlowSession" });
  const { writeContractAsync: settleSessionWrite } = useScaffoldWriteContract({ contractName: "TipFlowSession" });

  const { data: usdcTokenAddress } = useScaffoldReadContract({
    contractName: "TipFlowSession",
    functionName: "usdcToken",
  });

  const { writeContractAsync: writeContract } = useWriteContract();

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
              setTotalDeposited(amountWei.toString());
              setTips({}); // Clear any old tips
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

  const endSession = async () => {
    if (!sessionId) {
      return;
    }

    try {
      const recipients = Object.keys(tips);
      // Convert stored strings back to bigints for signing/contract call
      const amounts = recipients.map(r => BigInt(tips[r]));

      // Construct hash
      const packed = encodePacked(
        ["bytes32", "address[]", "uint256[]"],
        [sessionId as `0x${string}`, recipients as `0x${string}`[], amounts],
      );
      const messageHash = keccak256(packed);

      // Sign
      const signature = await walletClient?.signMessage({
        message: { raw: toBytes(messageHash) },
      });

      if (!signature) return;

      await settleSessionWrite({
        functionName: "settleSession",
        args: [sessionId as `0x${string}`, recipients, amounts, signature],
      });

      setTips({});
      setSessionId(null);
      setTotalDeposited("0");
      notification.success("Session Settled!");
    } catch (e) {
      console.error(e);
      notification.error("Settlement failed");
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
    totalDeposited: BigInt(totalDeposited), // Return BigInt version
    tokenDecimals,
  };
};
