"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { erc20Abi, formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";
import {
  ArrowDownTrayIcon,
  BoltIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function CreatorDashboard() {
  const { address } = useAccount();

  // 1. Fetch Token Details
  const { data: usdcTokenAddress } = useScaffoldReadContract({
    contractName: "TipFlowSession",
    functionName: "usdcToken",
  });

  const { data: tokenDecimals } = useReadContract({
    address: usdcTokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
    query: {
      enabled: !!usdcTokenAddress,
    },
  });

  const decimals = tokenDecimals ?? 6; // Default to 6 (USDC) if loading or failed

  // 2. Fetch TipReceived Events
  const { data: tipEvents, isLoading: isLoadingEvents } = useScaffoldEventHistory({
    contractName: "TipFlowSession",
    eventName: "TipReceived",
    filters: { recipient: address },
    watch: true,
  });

  // 3. Fetch Available Balance (Pull Payment)
  const { data: availableBalance } = useScaffoldReadContract({
    contractName: "TipFlowSession",
    functionName: "balances",
    args: [address],
    watch: true,
  });

  // 4. Withdraw Function
  const { writeContractAsync: withdrawWrite } = useScaffoldWriteContract({ contractName: "TipFlowSession" });

  const handleWithdraw = async () => {
    try {
      await withdrawWrite({
        functionName: "withdraw",
      });
    } catch (e) {
      console.error(e);
    }
  };

  // 5. Process Data
  const stats = useMemo(() => {
    if (!tipEvents || !address) return { totalReceived: 0n, totalTips: 0, uniqueTippers: 0, leaderboard: [] };

    let total = 0n;
    const tipperMap = new Map<string, bigint>();

    tipEvents.forEach((event: any) => {
      const amt = event.args.amount || 0n;
      total += amt;

      const tipper = event.args.tipper;
      if (tipper) {
        const current = tipperMap.get(tipper) || 0n;
        tipperMap.set(tipper, current + amt);
      }
    });

    // Create Leaderboard with Safe BigInt Sorting
    const leaderboard = Array.from(tipperMap.entries())
      .map(([tipper, amount]) => ({ tipper, amount }))
      .sort((a, b) => {
        if (a.amount === b.amount) return 0;
        return a.amount < b.amount ? 1 : -1; // Descending order
      });

    return {
      totalReceived: total,
      totalTips: tipEvents.length,
      uniqueTippers: tipperMap.size,
      leaderboard,
    };
  }, [tipEvents, address]);

  if (!address) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center max-w-sm mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gray-100 dark:border-gray-800"
          >
            <BoltIcon className="w-10 h-10 text-[#14B8A6]" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">Wallet Not Connected</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Please connect your wallet to view your dashboard and manage your earnings.
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white font-sans selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black">
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
              href="/app"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#14B8A6] transition-colors"
            >
              Back to App
            </Link>
            <div className="px-3 py-1 bg-[#14B8A6]/10 text-[#14B8A6] rounded-full text-xs font-bold uppercase tracking-wider">
              Creator Dashboard
            </div>
            <SwitchTheme className="" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-10">
          {/* Header Section */}
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Track your earnings and manage your funds.</p>
            </div>

            {/* Withdraw Card */}
            <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl flex items-center gap-6">
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Available Balance</div>
                <div className="text-3xl font-bold text-[#14B8A6]">
                  ${availableBalance ? formatUnits(availableBalance, decimals) : "0.00"}
                  <span className="text-sm text-gray-400 font-normal ml-2">USDC</span>
                </div>
              </div>
              <button
                onClick={handleWithdraw}
                disabled={!availableBalance || availableBalance <= 0n}
                className="btn bg-[#14B8A6] hover:bg-[#0D9488] text-white border-0 rounded-xl px-6 font-bold disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#14B8A6]/20"
              >
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Withdraw
              </button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="p-8 bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-[#14B8A6]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#14B8A6]/5"
            >
              <div className="w-12 h-12 bg-[#14B8A6]/10 rounded-xl flex items-center justify-center mb-4 text-[#14B8A6]">
                <CurrencyDollarIcon className="w-6 h-6" />
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Total Earnings</h3>
              <div className="text-4xl font-bold text-black dark:text-white">
                ${stats.totalReceived ? formatUnits(stats.totalReceived, decimals) : "0.00"}
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="p-8 bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-[#14B8A6]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#14B8A6]/5"
            >
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 text-purple-500">
                <ChartBarIcon className="w-6 h-6" />
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Total Tips</h3>
              <div className="text-4xl font-bold text-black dark:text-white">{stats.totalTips}</div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="p-8 bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-[#14B8A6]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#14B8A6]/5"
            >
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 text-orange-500">
                <UserGroupIcon className="w-6 h-6" />
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Unique Tippers</h3>
              <div className="text-4xl font-bold text-black dark:text-white">{stats.uniqueTippers}</div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ClockIcon className="w-6 h-6 text-gray-400" />
                  <h2 className="text-xl font-bold">Recent Activity</h2>
                </div>
              </div>
              <div className="p-0">
                {isLoadingEvents ? (
                  <div className="p-8 space-y-4">
                    <div className="skeleton h-12 w-full rounded-xl opacity-50"></div>
                    <div className="skeleton h-12 w-full rounded-xl opacity-50"></div>
                    <div className="skeleton h-12 w-full rounded-xl opacity-50"></div>
                  </div>
                ) : (tipEvents?.length || 0) > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 font-medium">
                        <tr>
                          <th className="px-8 py-4">Tipper</th>
                          <th className="px-8 py-4">Amount</th>
                          <th className="px-8 py-4">Transaction</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {tipEvents?.slice(0, 10).map((event: any, i: number) => (
                          <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-8 py-4">
                              <Address address={event.args.tipper} size="sm" />
                            </td>
                            <td className="px-8 py-4 font-bold text-[#14B8A6]">
                              +${formatUnits(event.args.amount || 0n, decimals)}
                            </td>
                            <td className="px-8 py-4">
                              <a
                                href={`https://sepolia.etherscan.io/tx/${event.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-gray-500 hover:text-[#14B8A6] flex items-center gap-1 transition-colors"
                              >
                                View on Etherscan
                                <ArrowDownTrayIcon className="w-3 h-3 -rotate-90" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center text-gray-500 italic">No tips received yet.</div>
                )}
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrophyIcon className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-bold">Top Supporters</h2>
                </div>
              </div>
              <div className="p-0">
                {(stats.leaderboard.length || 0) > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 font-medium">
                        <tr>
                          <th className="px-8 py-4">Rank</th>
                          <th className="px-8 py-4">User</th>
                          <th className="px-8 py-4">Total Tipped</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {stats.leaderboard.slice(0, 10).map((entry, i) => (
                          <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-8 py-4">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                  i === 0
                                    ? "bg-yellow-100 text-yellow-600"
                                    : i === 1
                                      ? "bg-gray-100 text-gray-600"
                                      : i === 2
                                        ? "bg-orange-100 text-orange-600"
                                        : "text-gray-500"
                                }`}
                              >
                                #{i + 1}
                              </div>
                            </td>
                            <td className="px-8 py-4">
                              <Address address={entry.tipper} size="sm" />
                            </td>
                            <td className="px-8 py-4 font-bold text-black dark:text-white">
                              ${formatUnits(entry.amount, decimals)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center text-gray-500 italic">No data yet.</div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/logo.svg" alt="TipFlow Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-lg text-black dark:text-white">TipFlow</span>
            </div>
            <div className="text-sm text-gray-500">© 2024 TipFlow Protocol. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
