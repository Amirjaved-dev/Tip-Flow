"use client";

import { useState } from "react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { CreatorList } from "~~/components/tipflow/CreatorList";
import { SessionCreate } from "~~/components/tipflow/SessionCreate";
import { SessionStatus } from "~~/components/tipflow/SessionStatus";
import { TipControl } from "~~/components/tipflow/TipControl";
import { TippingStream } from "~~/components/tipflow/TippingStream";

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const [sessionActive, setSessionActive] = useState(false);
  const [balance, setBalance] = useState("0");
  const [totalTipped, setTotalTipped] = useState("0");
  const [txCount, setTxCount] = useState(0);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);

  const startSession = (amount: string) => {
    setBalance(amount);
    setSessionActive(true);
  };

  const endSession = () => {
    setSessionActive(false);
    setBalance("0");
    setTotalTipped("0");
    setTxCount(0);
    setSelectedCreator(null);
  };

  const handleSelectCreator = (creator: any) => {
    setSelectedCreator(creator);
    // Scroll to top or specific section on mobile might be needed
  };

  const handleSendTip = (amount: string) => {
    const cost = parseFloat(amount);
    const current = parseFloat(balance);
    if (cost > current) {
      alert("Insufficient session balance!");
      return;
    }
    setBalance((current - cost).toFixed(2));
    setTotalTipped((parseFloat(totalTipped) + cost).toFixed(2));
    setTxCount(prev => prev + 1);
    // In a real app, this would also add to the TippingStream
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

  if (!sessionActive) {
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

      <SessionStatus balance={balance} totalTipped={totalTipped} transactionCount={txCount} onEndSession={endSession} />

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
