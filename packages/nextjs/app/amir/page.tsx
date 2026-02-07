"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowRightIcon,
    BoltIcon,
    CurrencyDollarIcon,
    ShieldCheckIcon,
    CheckCircleIcon,
    PlusIcon,
    MinusIcon,
    SparklesIcon,
    UserGroupIcon,
    GlobeAltIcon
} from "@heroicons/react/24/outline";

// --- Components ---

const SectionHeading = ({ children, align = "center" }: { children: React.ReactNode; align?: "left" | "center" }) => (
    <h2 className={`text-3xl md:text-5xl font-bold mb-6 tracking-tight ${align === "center" ? "text-center" : "text-left"}`}>
        {children}
    </h2>
);

const SectionSubheading = ({ children, align = "center" }: { children: React.ReactNode; align?: "left" | "center" }) => (
    <p className={`text-zinc-400 max-w-2xl text-lg leading-relaxed ${align === "center" ? "mx-auto text-center" : "text-left"}`}>
        {children}
    </p>
);

const LiveActivityItem = ({ name, amount, time, avatarColor }: { name: string; amount: string; time: string; avatarColor: string }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm animate-fade-in">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${avatarColor}`}>
            {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
                <span className="text-zinc-400">Tip from</span> {name}
            </p>
            <p className="text-xs text-zinc-500">{time}</p>
        </div>
        <div className="text-emerald-400 font-mono font-medium">
            +{amount}
        </div>
    </div>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/10 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
            >
                <span className="text-lg font-medium text-zinc-200 group-hover:text-white transition-colors">{question}</span>
                <span className={`ml-6 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    {isOpen ? <MinusIcon className="w-5 h-5 text-indigo-400" /> : <PlusIcon className="w-5 h-5 text-zinc-500" />}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"}`}
            >
                <p className="text-zinc-400 leading-relaxed pr-6">
                    {answer}
                </p>
            </div>
        </div>
    );
};

export default function AmirLandingPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 selection:text-indigo-200 font-sans">

            {/* --- Simple Nav Backdrop (Visual only, simulates header integration) --- */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#050505] to-transparent z-0 pointer-events-none" />

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-5xl mx-auto">

                        {/* Pill Label */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default">
                            <SparklesIcon className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium text-zinc-300">The Future of Micro-Payments</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-tight text-white">
                            Monetize <br className="hidden md:block" />
                            <span className="relative whitespace-nowrap">
                                <span className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl rounded-full"></span>
                                <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300">
                                    Your Influence
                                </span>
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                            Accept crypto tips instantly. No fees. No delays. <br className="hidden md:block" />
                            Just pure, gasless value transfer.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
                            <Link
                                href="/"
                                className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-950 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3"
                            >
                                Start Earning <ArrowRightIcon className="w-5 h-5" />
                            </Link>
                            <a
                                href="#demo"
                                className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center backdrop-blur-sm"
                            >
                                View Demo
                            </a>
                        </div>
                    </div>
                </div>

                {/* Ambient Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-indigo-600/10 rounded-[100%] blur-[130px] -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
            </section>

            {/* --- TRUSTED BY SECTION --- */}
            <section className="py-12 border-y border-white/5 bg-white/[0.02]">
                <div className="container mx-auto px-6">
                    <p className="text-center text-sm font-medium text-zinc-500 uppercase tracking-widest mb-8">Trusted by next-gen creators</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Simple Text Placeholders for Logos to keep it clean and robust without external assets */}
                        <span className="text-xl font-bold font-mono text-white">BLOCK<span className="text-indigo-500">CHAIN</span></span>
                        <span className="text-xl font-bold font-serif italic text-white">Creator<span className="text-zinc-600">DAO</span></span>
                        <span className="text-2xl font-black tracking-tighter text-white">STREAM<span className="text-purple-500">LABS</span></span>
                        <span className="text-xl font-bold text-white flex items-center gap-1"><div className="w-6 h-6 bg-white rounded-full"></div>Pixel</span>
                        <span className="text-xl font-semibold text-white">NEXUS</span>
                    </div>
                </div>
            </section>

            {/* --- LIVE ACTIVITY & FEATURES SPLIT --- */}
            <section id="demo" className="py-24 md:py-32 relative">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Text Content */}
                        <div>
                            <div className="inline-block px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
                                Live Feed
                            </div>
                            <SectionHeading align="left">Real-time payments,<br /> visualized.</SectionHeading>
                            <SectionSubheading align="left">
                                See global tipping activity as it happens. Our settlement engine processes transactions instantly, ensuring creators get paid the moment a fan hits "send".
                            </SectionSubheading>

                            <div className="mt-10 grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-3xl font-bold text-white mb-1">0%</h4>
                                    <p className="text-zinc-500 text-sm">Gas Fees for Donors</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-white mb-1">&lt; 2s</h4>
                                    <p className="text-zinc-500 text-sm">Settlement Time</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-white mb-1">$1.2M+</h4>
                                    <p className="text-zinc-500 text-sm">Processed Volume</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-white mb-1">10k+</h4>
                                    <p className="text-zinc-500 text-sm">Active Creators</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Simulated Live Activity Feed (Card) */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-20 transform rotate-2"></div>
                            <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden">
                                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        Live Transactions
                                    </h3>
                                    <span className="text-xs text-zinc-500">Sepolia Testnet</span>
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

                                {/* Fade overlay at bottom */}
                                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- BENTO GRID FEATURES --- */}
            <section className="py-24 bg-zinc-900/30">
                <div className="container mx-auto px-6">
                    <SectionHeading>Everything you need to grow.</SectionHeading>
                    <SectionSubheading>Powerful tools built for the decentralized web.</SectionSubheading>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                        {/* Large Card */}
                        <div className="md:col-span-2 bg-[#0F0F10] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 text-indigo-400">
                                    <CurrencyDollarIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Gasless Tipping</h3>
                                <p className="text-zinc-400 max-w-sm">We subsidize all gas fees for your donors using Account Abstraction. They pay exactly what they want to tip, and you receive every cent.</p>
                            </div>
                        </div>

                        {/* Tall Card */}
                        <div className="md:row-span-2 bg-[#0F0F10] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors relative overflow-hidden group">
                            <div className="absolute  bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-500/5 to-transparent"></div>
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 text-emerald-400">
                                    <ShieldCheckIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Non-Custodial</h3>
                                <p className="text-zinc-400 mb-6 font-light leading-relaxed">
                                    Your funds never touch our servers. Smart contracts handle everything, sending crypto directly to your wallet.
                                </p>
                                <div className="mt-auto pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-sm text-zinc-300">
                                        <CheckCircleIcon className="w-5 h-5 text-emerald-500" /> Audited Contracts
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-zinc-300 mt-2">
                                        <CheckCircleIcon className="w-5 h-5 text-emerald-500" /> Open Source
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-zinc-300 mt-2">
                                        <CheckCircleIcon className="w-5 h-5 text-emerald-500" /> Verified on Etherscan
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Medium Card */}
                        <div className="bg-[#0F0F10] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors group">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6 text-amber-400">
                                <BoltIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Instant Settlement</h3>
                            <p className="text-zinc-400 text-sm">No Payout Thresholds. Get paid in seconds.</p>
                        </div>

                        {/* Medium Card */}
                        <div className="bg-[#0F0F10] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors group">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6 text-cyan-400">
                                <GlobeAltIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Global Access</h3>
                            <p className="text-zinc-400 text-sm">Accept tips from anyone, anywhere in the world.</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6 max-w-3xl">
                    <SectionHeading>Frequently Asked Questions</SectionHeading>

                    <div className="mt-12 space-y-2">
                        <FAQItem
                            question="Do I need to pay gas fees?"
                            answer="No! We use Account Abstraction technology to sponsor gas fees for all tipping transactions. Your donors pay $0 in gas."
                        />
                        <FAQItem
                            question="Which networks do you support?"
                            answer="Currently, we are live on the Sepolia Testnet for beta testing. Mainnet launch is scheduled for Q4 2024 supporting Base, Optimism, and Arbitrum."
                        />
                        <FAQItem
                            question="Is there a minimum payout amount?"
                            answer="There are no minimums. Since transactions are settled on-chain instantly, funds appear in your wallet immediately."
                        />
                        <FAQItem
                            question="How do I cash out to functionality?"
                            answer="You receive USDC directly to your crypto wallet. You can then use any major exchange (Coinbase, Binance, etc.) or off-ramp service to convert to your local currency."
                        />
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-950/20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl -z-10"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">
                        Ready to start your journey?
                    </h2>
                    <p className="text-xl text-zinc-400 mb-10 max-w-xl mx-auto">
                        Join the platform that puts creators first. Secure, fast, and completely free to start.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/"
                            className="px-10 py-5 bg-white text-zinc-950 rounded-full font-bold text-lg hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            Connect Wallet
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- FOOTER (Mini) --- */}
            <footer className="py-12 border-t border-white/5 bg-[#020202]">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-xl font-bold tracking-tighter">Tip-Flow</div>
                    <div className="text-zinc-600 text-sm">
                        &copy; 2024 Tip-Flow Protocol. Built with Next.js & Scaffold-ETH 2.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-zinc-500 hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="text-zinc-500 hover:text-white transition-colors">GitHub</a>
                        <a href="#" className="text-zinc-500 hover:text-white transition-colors">Discord</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}
