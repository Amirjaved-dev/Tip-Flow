"use client";

import { useEffect, useState } from "react";
import { CreatorList } from "../../components/tipflow/CreatorList";
import { SessionCreate } from "../../components/tipflow/SessionCreate";
import { SessionStatus } from "../../components/tipflow/SessionStatus";
import { TipControl } from "../../components/tipflow/TipControl";
import { TippingStream } from "../../components/tipflow/TippingStream";
import { useYellowSession } from "../../hooks/tipflow/useYellowSession";
import { NextPage } from "next";
import { createPublicClient, formatUnits, http } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { useAccount } from "wagmi";
import { UserIcon } from "@heroicons/react/20/solid";
import { WalletIcon } from "@heroicons/react/24/outline";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

interface Creator {
  id: string;
  name: string;
  address?: string;
  wallet?: string;
  ens?: string;
  description?: string;
  avatar?: string;
}

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const {
    sessionId,
    tips,
    createSession,
    endSession: hookEndSession,
    addTip,
    totalDeposited,
    tokenDecimals,
  } = useYellowSession();

  // Derived state
  const tipsArray = Object.values(tips);
  const totalTippedVal = tipsArray.length > 0 ? tipsArray.reduce((acc, val) => acc + val, 0n) : 0n;

  // Format for display
  const balance = totalDeposited > 0n ? formatUnits(totalDeposited - totalTippedVal, tokenDecimals || 18) : "0";
  const totalTippedDisplay = formatUnits(totalTippedVal, tokenDecimals || 18);

  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const startSession = async (amount: string) => {
    await createSession(amount);
  };

  const endSession = async () => {
    await hookEndSession();
    setSelectedCreator(null);
  };

  const handleSelectCreator = (creator: Creator) => {
    setSelectedCreator(creator);
  };

  const handleSendTip = async (amount: string) => {
    let recipientAddress = selectedCreator?.address || selectedCreator?.wallet;

    if (!recipientAddress) {
      alert("Creator address missing");
      return;
    }

    // Resolve ENS if needed
    if (
      recipientAddress.includes(".") &&
      !recipientAddress.includes("..") &&
      !recipientAddress.startsWith(".") &&
      !recipientAddress.endsWith(".")
    ) {
      try {
        const normalizedName = normalize(recipientAddress);
        const resolved = await publicClient.getEnsAddress({
          name: normalizedName,
        });
        if (resolved) {
          recipientAddress = resolved;
        }
      } catch (e) {
        console.error("ENS Resolution error", e);
        // Continue with original address if resolution fails
      }
    }

    addTip(recipientAddress, amount);
  };

  if (!mounted) return null;

  // ---------------------------------------------------------------------------
  // View 1: Unauthenticated Hero
  // ---------------------------------------------------------------------------
  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-base-content font-sans p-4">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-100 border border-base-300 text-sm font-medium text-base-content/60 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary/60"></span>
            Powered by Yellow Network
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-base-content">
            Stream Value. <br />
            <span className="text-primary">Instantly.</span>
          </h1>

          <p className="text-xl text-base-content/60 leading-relaxed">
            The gasless tipping protocol for web3 creators. <br className="hidden md:block" />
            Connect, deposit, and flow. Without the friction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            {/* The Connect Button is handled by RainbowKit in Header usually, but we can have a call to action here */}
            <p className="text-sm font-medium text-base-content/40">Connect your wallet to get started</p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // View 2: No Active Session (Authenticated)
  // ---------------------------------------------------------------------------
  if (!sessionId) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-base-200">
        <SessionCreate onStartSession={startSession} />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // View 3: Active Dashboard (Main App)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-base-200 p-4 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header / Stats Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-base-content tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              State Channel Active
            </div>
          </div>

          <div className="w-full md:w-auto">
            <SessionStatus
              balance={balance}
              totalTipped={totalTippedDisplay}
              transactionCount={Object.keys(tips).length}
              onEndSession={endSession}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] min-h-[600px]">
          {/* Left Column: Creator Discovery (3 cols) */}
          <div className="lg:col-span-3 flex flex-col h-full bg-base-100 border border-base-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-base-200 bg-base-50/50">
              <h2 className="font-bold text-base-content flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-base-content/50" />
                Creators
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <CreatorList onSelectCreator={handleSelectCreator} />
            </div>
          </div>

          {/* Middle Column: Active Tipping (6 cols) */}
          <div className="lg:col-span-6 flex flex-col h-full bg-base-100 border border-base-200 rounded-xl overflow-hidden shadow-sm relative">
            <div className="absolute inset-0 bg-[url('/grid-clean.svg')] opacity-[0.02]"></div>
            <div className="flex-1 flex flex-col justify-center p-8 relative z-10">
              {selectedCreator ? (
                <TipControl
                  recipientName={selectedCreator.name}
                  onSendTip={handleSendTip}
                  disabled={parseFloat(balance) <= 0}
                />
              ) : (
                <div className="text-center space-y-4 opacity-40">
                  <div className="w-16 h-16 bg-base-200 rounded-full mx-auto flex items-center justify-center border border-base-300">
                    <WalletIcon className="w-8 h-8 text-base-content" />
                  </div>
                  <p className="text-lg font-medium">Select a creator to start tipping</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Feed (3 cols) */}
          <div className="lg:col-span-3 flex flex-col h-full bg-base-100 border border-base-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 h-full">
              <TippingStream />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
