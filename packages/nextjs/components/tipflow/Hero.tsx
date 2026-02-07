"use strict";
import { ArrowRightIcon, BoltIcon, RocketLaunchIcon, SparklesIcon } from "@heroicons/react/24/outline";

const LiveActivityItem = ({
    name,
    amount,
    time,
    avatarColor,
}: {
    name: string;
    amount: string;
    time: string;
    avatarColor: string;
}) => (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm animate-fade-in transition-all duration-300 hover:bg-zinc-800/50">
        <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${avatarColor}`}
        >
            {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
                <span className="text-zinc-400">Tip from</span> {name}
            </p>
            <p className="text-xs text-zinc-500">{time}</p>
        </div>
        <div className="text-emerald-400 font-mono font-medium">+{amount}</div>
    </div>
);

export const Hero = ({ openConnectModal }: { openConnectModal?: () => void }) => {
    return (
        <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 overflow-hidden min-h-[90vh] flex items-center">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* --- LEFT COLUMN: CONTENT --- */}
                    <div className="flex flex-col items-start text-left stagger-container">

                        {/* Pill Label */}
                        <div className="slide-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-8 hover:bg-indigo-500/20 transition-all cursor-default shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)]">
                            <SparklesIcon className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-semibold text-indigo-300">The Future of Micro-Payments</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="slide-up text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.2] text-white">
                            Monetize <br className="hidden md:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-white to-purple-400">
                                Your Influence
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="slide-up text-xl md:text-2xl text-zinc-300 mb-10 max-w-xl leading-relaxed font-light">
                            Accept crypto tips instantly. No fees. No delays. Just pure, gasless value transfer directly to your wallet.
                        </p>

                        {/* CTA Buttons */}
                        <div className="slide-up flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
                            <button
                                onClick={openConnectModal}
                                className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-950 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3"
                            >
                                Start Earning <ArrowRightIcon className="w-5 h-5" />
                            </button>
                            <a
                                href="#demo"
                                className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/10 transition-all hover:-translate-y-1 flex items-center justify-center"
                            >
                                View Demo
                            </a>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: VISUAL / LIVE ACTIVITY --- */}
                    <div className="relative fade-in delay-500 hidden md:block">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 rounded-full blur-[100px] -z-10 transform scale-75"></div>

                        <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-500 ease-out lift-hover">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-20"></div>
                            <div className="relative bg-[#0A0A0A]/90 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden backdrop-blur-xl">
                                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        Live Transactions
                                    </h3>
                                    <span className="text-xs text-zinc-500 font-mono">Sepolia Testnet</span>
                                </div>

                                <div className="space-y-4">
                                    <LiveActivityItem name="Alex Rivera" amount="5.00 USDC" time="Just now" avatarColor="bg-blue-600" />
                                    <LiveActivityItem name="Sarah Chen" amount="10.00 USDC" time="12s ago" avatarColor="bg-pink-600" />
                                    <LiveActivityItem name="CryptoKing" amount="2.50 USDC" time="45s ago" avatarColor="bg-amber-600" />
                                    <LiveActivityItem name="AnonUser" amount="1.00 USDC" time="1m ago" avatarColor="bg-zinc-600" />
                                    <div className="opacity-50">
                                        <LiveActivityItem name="MikeD" amount="20.00 USDC" time="2m ago" avatarColor="bg-purple-600" />
                                    </div>
                                </div>

                                {/* Simulated fade at bottom */}
                                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none"></div>
                            </div>

                            {/* Decorative floating elements */}
                            <div className="absolute -top-10 -right-10 bg-zinc-900/80 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-md animate-bounce duration-[3000ms] lift-hover">
                                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                                    <RocketLaunchIcon className="w-6 h-6 text-indigo-400" />
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-zinc-900/90 border border-emerald-500/20 p-4 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 animate-pulse-slow lift-hover">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <BoltIcon className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-zinc-400 font-medium">Network Cost</span>
                                    <span className="text-sm font-bold text-emerald-400">Gasless</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ambient Background Effects */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[130px] -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/3 translate-y-1/3" />
        </section>
    );
};
