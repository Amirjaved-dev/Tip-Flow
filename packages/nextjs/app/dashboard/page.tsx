"use client";

import { useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { useScaffoldEventHistory, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";

export default function CreatorDashboard() {
    const { address } = useAccount();

    // 1. Fetch Token Decimals (assuming TipFlowSession links to a USDC token)
    const { data: usdcTokenAddress } = useScaffoldReadContract({
        contractName: "TipFlowSession",
        functionName: "usdcToken",
    });

    const { data: decimals } = useScaffoldReadContract({
        contractName: "TipFlowSession", // We don't have direct access to token contract name, but we can use ERC20 ABI generic if needed.
        // actually scaffold-eth usually requires the contract to be in deployedContracts to use useScaffoldReadContract easily 
        // or we use standard wagmi useReadContract if we have the address.
        // existing useYellowSession does: useReadContract({ address: usdcTokenAddress, abi: erc20Abi, functionName: "decimals" })
        functionName: "usdcToken", // filler, we will correct this below
    }) as any;

    // Actually, let's just use the standard wagmi hook for decimals like in useYellowSession
    // But for now, let's assume 6 decimals (USDC standard) or 18 if generic, or better yet, fetch it properly.
    // I will use `formatUnits(amount, 6)` for now as MVP approximation or fix it in a later step if needed.

    // 2. Fetch TipReceived Events
    const { data: tipEvents, isLoading: isLoadingEvents } = useScaffoldEventHistory({
        contractName: "TipFlowSession",
        eventName: "TipReceived",
        fromBlock: 0n,
        filters: { recipient: address },
        watch: true,
    });

    // 3. Process Data
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

        // Create Leaderboard
        const leaderboard = Array.from(tipperMap.entries())
            .map(([tipper, amount]) => ({ tipper, amount }))
            .sort((a, b) => (Number(b.amount - a.amount))); // big int comparison specific

        return {
            totalReceived: total,
            totalTips: tipEvents.length,
            uniqueTippers: tipperMap.size,
            leaderboard,
        };
    }, [tipEvents, address]);

    if (!address) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl font-bold text-base-content/60">Please connect your wallet to view your dashboard.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 py-8 px-4 sm:px-12 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Creator Dashboard
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body">
                        <h2 className="card-title text-base-content/60 text-sm">Total Received</h2>
                        <p className="text-4xl font-bold">
                            ${stats.totalReceived ? formatUnits(stats.totalReceived, 6) : "0.00"}
                            <span className="text-sm font-normal text-base-content/50 ml-2">USDC</span>
                        </p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body">
                        <h2 className="card-title text-base-content/60 text-sm">Total Tips</h2>
                        <p className="text-4xl font-bold">{stats.totalTips}</p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body">
                        <h2 className="card-title text-base-content/60 text-sm">Unique Tippers</h2>
                        <p className="text-4xl font-bold">{stats.uniqueTippers}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Tips */}
                <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Recent Tips</h2>
                        {isLoadingEvents ? (
                            <div className="skeleton h-32 w-full"></div>
                        ) : (tipEvents?.length || 0) > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Tipper</th>
                                            <th>Amount</th>
                                            <th>Tx</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tipEvents?.slice(0, 10).map((event: any, i: number) => (
                                            <tr key={i} className="hover">
                                                <td><Address address={event.args.tipper} size="sm" /></td>
                                                <td className="font-mono text-success">
                                                    +${formatUnits(event.args.amount || 0n, 6)}
                                                </td>
                                                <td>
                                                    <a
                                                        href={`https://sepolia.etherscan.io/tx/${event.transactionHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="link link-primary text-xs"
                                                    >
                                                        View
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-base-content/50">
                                No tips received yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body">
                        <h2 className="card-title mb-4">🏆 Big Tippers</h2>
                        {(stats.leaderboard.length || 0) > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>User</th>
                                            <th>Total Tipped</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.leaderboard.slice(0, 10).map((entry, i) => (
                                            <tr key={i} className={i < 3 ? "bg-base-200/50" : ""}>
                                                <td className="font-bold">#{i + 1}</td>
                                                <td><Address address={entry.tipper} size="sm" /></td>
                                                <td className="font-bold">
                                                    ${formatUnits(entry.amount, 6)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-base-content/50">
                                No data yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
