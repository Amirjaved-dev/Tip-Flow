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
import { ConnectButton } from "@rainbow-me/rainbowkit";
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-4 py-12">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
            </span>
            Live on Sepolia
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Start Tipping in <br className="hidden sm:block" />
            <span className="text-gray-400">Seconds</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Deposit once, tip endlessly. Zero gas fees. <br className="hidden md:block" />
            Instant settlement through state channels.
          </p>

          {/* CTA - RainbowKit ConnectButton */}
          <div className="pt-4">
            <div className="mb-6">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== 'loading';
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === 'authenticated');

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              type="button"
                              className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold text-lg rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all hover:shadow-lg active:scale-95"
                            >
                              Connect Wallet
                            </button>
                          );
                        }

                        return null;
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Get started in seconds
            </p>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center border border-gray-200 dark:border-gray-800">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-medium">Zero Gas Fees</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center border border-gray-200 dark:border-gray-800">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium">Instant Settlement</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center border border-gray-200 dark:border-gray-800">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="font-medium">Secure</span>
              </div>
            </div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Status Bar with Metrics */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="grid grid-cols-3 gap-4 flex-1 w-full">
            {/* Balance Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-all">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="font-medium">Balance</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${balance}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">USDC</div>
            </div>

            {/* Total Tips Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-all">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="font-medium">Total Tips</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalTippedDisplay}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Sent</div>
            </div>

            {/* Recipients Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-all">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium">Recipients</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Object.keys(tips).length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Creators</div>
            </div>
          </div>

          {/* End Session Button */}
          <button
            onClick={endSession}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all"
          >
            End Session
          </button>
        </div>

        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">

          {/* Left Panel: Creator List (30%) */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <h2 className="font-semibold text-lg">Creators</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <CreatorList onSelectCreator={handleSelectCreator} />
            </div>
          </div>

          {/* Center Panel: Tip Control (45%) */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col justify-center p-8">
            {selectedCreator ? (
              <TipControl
                recipientName={selectedCreator.name}
                onSendTip={handleSendTip}
                disabled={parseFloat(balance) <= 0}
              />
            ) : (
              <div className="text-center space-y-4 opacity-40">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  <WalletIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">Select a creator to start tipping</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose from the list on the left</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Live Feed (25%) */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4">
              <TippingStream />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
