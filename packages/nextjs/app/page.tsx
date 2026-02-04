"use client";

import { useState } from "react";
import { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { CreatorList } from "~~/components/tipflow/CreatorList";
import { SessionCreate } from "~~/components/tipflow/SessionCreate";
import { SessionStatus } from "~~/components/tipflow/SessionStatus";
import { TipControl } from "~~/components/tipflow/TipControl";
import { TippingStream } from "~~/components/tipflow/TippingStream";
import { useYellowSession } from "~~/hooks/tipflow/useYellowSession";

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const {
    sessionId,
    tips,
    createSession,
    endSession: hookEndSession, // Rename to avoid conflict if needed, or just use it
    addTip,
    totalDeposited,
  } = useYellowSession();

  // Derived state
  const tipsArray = Object.values(tips);
  const totalTippedVal = tipsArray.length > 0 ? tipsArray.reduce((test, val) => test + val, 0n) : 0n;
  // Format for display
  const balance = totalDeposited > 0n ? formatEther(totalDeposited - totalTippedVal) : "0";
  const totalTippedDisplay = formatEther(totalTippedVal);

  const [selectedCreator, setSelectedCreator] = useState<any>(null);

  const startSession = async (amount: string) => {
    await createSession(amount);
  };

  const endSession = async () => {
    await hookEndSession();
    setSelectedCreator(null);
  };

  const handleSelectCreator = (creator: any) => {
    setSelectedCreator(creator);
  };

  const handleSendTip = (amount: string) => {
    if (!selectedCreator?.address) {
      // Assuming creator object has address
      // For now, if creator logic not fully blocked out, use valid placeholder or fail
      alert("Creator address missing");
      return;
    }
    addTip(selectedCreator.address, amount);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-gradient-to-br from-base-100 to-base-200">
        <div className="text-center max-w-2xl animate-fade-in-up">
          <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent filter drop-shadow-lg">
            TipFlow
          </h1>
          <p className="text-2xl mb-8 text-base-content/80 font-light">
            Streaming value to creators <br />
            <span className="font-bold text-primary">Gasless. Instant. Seamless.</span>
          </p>
          <div className="mockup-code bg-base-300 text-base-content shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-500 mb-10 w-full max-w-lg mx-auto text-left">
            <pre data-prefix="$">
              <code>connect_wallet()</code>
            </pre>
            <pre data-prefix=">">
              <code>Starting session...</code>
            </pre>
            <pre data-prefix=">" className="text-success">
              <code>Gas fees eliminated.</code>
            </pre>
          </div>
          <p className="text-base-content/60">Connect your wallet to start.</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] -z-10 animate-pulse delay-700"></div>

        <SessionCreate onStartSession={startSession} />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-7xl mx-auto min-h-screen">
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold">Active Session</h1>
        <p className="text-base-content/60">Connected to Yellow Network State Channel</p>
      </div>

      <SessionStatus
        balance={balance}
        totalTipped={totalTippedDisplay}
        transactionCount={Object.keys(tips).length}
        onEndSession={endSession}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Creator Discovery & Selection */}
        <div className="lg:col-span-4 space-y-6">
          <CreatorList onSelectCreator={handleSelectCreator} />
        </div>

        {/* Middle Column: Active Tipping Context */}
        <div className="lg:col-span-4 space-y-6">
          {selectedCreator ? (
            <TipControl
              recipientName={selectedCreator.name}
              onSendTip={handleSendTip}
              disabled={parseFloat(balance) <= 0}
            />
          ) : (
            <div className="glass-panel p-10 rounded-xl flex items-center justify-center text-center h-64 border-2 border-dashed border-base-content/20 bg-base-100/30">
              <div>
                <p className="text-lg font-bold opacity-50">Select a creator to start tipping</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Feed */}
        <div className="lg:col-span-4">
          <div className="glass-panel h-[600px] rounded-xl overflow-hidden sticky top-4">
            <TippingStream />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
