"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreatorList } from "../../components/tipflow/CreatorList";
import { SessionCreate } from "../../components/tipflow/SessionCreate";
import { TipControl } from "../../components/tipflow/TipControl";
import { useYellowSession } from "../../hooks/tipflow/useYellowSession";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AnimatePresence, motion } from "framer-motion";
import { NextPage } from "next";
import { createPublicClient, formatUnits, http } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { useAccount } from "wagmi";
import { UserIcon } from "@heroicons/react/20/solid";
import { BoltIcon, ChartBarIcon, WalletIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";

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

    addTip(recipientAddress, amount, selectedCreator?.name);
  };

  if (!mounted) return null;

  // ---------------------------------------------------------------------------
  // View 1: Unauthenticated Hero
  // ---------------------------------------------------------------------------
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Navigation */}
        <nav className="fixed w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                className="w-10 h-10 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <img src="/logo.svg" alt="TipFlow Logo" className="w-full h-full object-contain" />
              </motion.div>
              <span className="text-xl font-bold tracking-tight group-hover:text-[#14B8A6] transition-colors">
                TipFlow
              </span>
            </Link>
            <div className="flex items-center gap-8">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-gray-700 dark:text-gray-300 hover:text-[#14B8A6] dark:hover:text-[#14B8A6] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <ChartBarIcon className="w-5 h-5" />
                <span>Creator Dashboard</span>
              </Link>
              <SwitchTheme className="" />
            </div>
          </div>
        </nav>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 px-4 py-12 pt-28"
        >
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-medium"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14B8A6]"></span>
              </span>
              Live on Sepolia
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
            >
              Start Tipping in <br className="hidden sm:block" />
              <span className="text-gray-400">Seconds</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              Deposit once, tip endlessly. Zero gas fees. <br className="hidden md:block" />
              Instant settlement through state channels.
            </motion.p>

            {/* CTA - RainbowKit ConnectButton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="pt-4"
            >
              <div className="mb-6">
                <ConnectButton.Custom>
                  {({ account, chain, openConnectModal, authenticationStatus, mounted }) => {
                    const ready = mounted && authenticationStatus !== "loading";
                    const connected =
                      ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

                    return (
                      <div
                        {...(!ready && {
                          "aria-hidden": true,
                          style: {
                            opacity: 0,
                            pointerEvents: "none",
                            userSelect: "none",
                          },
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <motion.button
                                onClick={openConnectModal}
                                type="button"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-5 bg-[#14B8A6] text-white font-bold text-lg rounded-full hover:bg-[#0D9488] hover:shadow-xl hover:shadow-[#14B8A6]/50 transition-all"
                              >
                                Connect Wallet
                              </motion.button>
                            );
                          }

                          return null;
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Get started in seconds</p>

              {/* Trust Signals */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-6 pt-8"
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/30 flex items-center justify-center">
                    <BoltIcon className="w-5 h-5 text-[#14B8A6]" />
                  </div>
                  <span className="font-medium">Zero Gas Fees</span>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Instant Settlement</span>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Secure</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img src="/logo.svg" alt="TipFlow Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-bold text-lg">TipFlow</span>
                </div>
                <p className="text-sm text-gray-500">The zero-gas tipping protocol for the modern web.</p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      SDK
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
              <div className="text-sm text-gray-500">© 2024 TipFlow Protocol. All rights reserved.</div>
              <div className="flex gap-6">
                <Link href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  Twitter
                </Link>
                <Link href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  GitHub
                </Link>
                <Link href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  Discord
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // View 2: No Active Session (Authenticated)
  // ---------------------------------------------------------------------------
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Navigation */}
        <nav className="fixed w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                className="w-10 h-10 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <img src="/logo.svg" alt="TipFlow Logo" className="w-full h-full object-contain" />
              </motion.div>
              <span className="text-xl font-bold tracking-tight group-hover:text-[#14B8A6] transition-colors">
                TipFlow
              </span>
            </Link>
            <div className="flex items-center gap-8">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-gray-700 dark:text-gray-300 hover:text-[#14B8A6] dark:hover:text-[#14B8A6] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <ChartBarIcon className="w-5 h-5" />
                <span>Creator Dashboard</span>
              </Link>
              <SwitchTheme className="" />
            </div>
          </div>
        </nav>

        <div className="pt-20">
          <SessionCreate onStartSession={startSession} />
        </div>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img src="/logo.svg" alt="TipFlow Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-bold text-lg">TipFlow</span>
                </div>
                <p className="text-sm text-gray-500">The zero-gas tipping protocol for the modern web.</p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      SDK
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
              <div className="text-sm text-gray-500">© 2024 TipFlow Protocol. All rights reserved.</div>
              <div className="flex gap-6">
                <Link href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  Twitter
                </Link>
                <Link href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  GitHub
                </Link>
                <Link href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  Discord
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // View 3: Active Dashboard (Main App)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="w-10 h-10 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <img src="/logo.svg" alt="TipFlow Logo" className="w-full h-full object-contain" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight group-hover:text-[#14B8A6] transition-colors">
              TipFlow
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-gray-700 dark:text-gray-300 hover:text-[#14B8A6] dark:hover:text-[#14B8A6] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <ChartBarIcon className="w-5 h-5" />
              <span>Creator Dashboard</span>
            </Link>
            <SwitchTheme className="" />
          </div>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-white dark:bg-slate-950 pt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Status Bar with Metrics */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14B8A6]"></span>
                </span>
                <span className="text-[#14B8A6] font-bold">Live Session</span>
              </div>
            </motion.div>

            {/* End Session Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onClick={endSession}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-sm hover:shadow-md"
            >
              End Session
            </motion.button>
          </div>

          {/* Metric Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {/* Balance Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-[#14B8A6]/50 dark:hover:border-[#14B8A6]/50 transition-all shadow-sm hover:shadow-xl hover:shadow-[#14B8A6]/10"
            >
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-3">
                <div className="w-8 h-8 bg-[#14B8A6]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <span className="font-semibold">Balance</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">${balance}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">USDC Available</div>
            </motion.div>

            {/* Total Tips Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-[#14B8A6]/50 dark:hover:border-[#14B8A6]/50 transition-all shadow-sm hover:shadow-xl hover:shadow-[#14B8A6]/10"
            >
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-3">
                <div className="w-8 h-8 bg-[#14B8A6]/10 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-4 h-4 text-[#14B8A6]" />
                </div>
                <span className="font-semibold">Total Tips</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">${totalTippedDisplay}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">Sent to Creators</div>
            </motion.div>

            {/* Recipients Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-[#14B8A6]/50 dark:hover:border-[#14B8A6]/50 transition-all shadow-sm hover:shadow-xl hover:shadow-[#14B8A6]/10"
            >
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-3">
                <div className="w-8 h-8 bg-[#14B8A6]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <span className="font-semibold">Recipients</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{Object.keys(tips).length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">Unique Creators</div>
            </motion.div>
          </motion.div>

          {/* Main 2-Column Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]"
          >
            {/* Left Panel: Creator List (40%) */}
            <div className="lg:col-span-5 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-lg transition-all">
              <div className="p-5 border-b-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <div className="w-8 h-8 bg-[#14B8A6]/10 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-[#14B8A6]" />
                  </div>
                  <h2 className="font-bold text-lg">Creators</h2>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <CreatorList onSelectCreator={handleSelectCreator} />
              </div>
            </div>

            {/* Right Panel: Tip Control (60%) */}
            <div className="lg:col-span-7 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col justify-center p-8 shadow-sm hover:shadow-lg transition-all">
              <AnimatePresence mode="wait">
                {selectedCreator ? (
                  <motion.div
                    key="tip-control"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TipControl
                      recipientName={selectedCreator.name}
                      onSendTip={handleSendTip}
                      disabled={parseFloat(balance) <= 0}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="text-center space-y-6 py-12"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-2xl mx-auto flex items-center justify-center border-2 border-gray-200 dark:border-gray-700"
                    >
                      <WalletIcon className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                    </motion.div>
                    <div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Select a creator to start tipping
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Choose from the list on the left</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img src="/logo.svg" alt="TipFlow Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-bold text-lg">TipFlow</span>
                </div>
                <p className="text-sm text-gray-500">The zero-gas tipping protocol for the modern web.</p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      SDK
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black dark:hover:text-white">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
              <div className="text-sm text-gray-500">© 2024 TipFlow Protocol. All rights reserved.</div>
              <div className="flex gap-6">
                <Link href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  Twitter
                </Link>
                <Link href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  GitHub
                </Link>
                <Link href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  Discord
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default Home;
