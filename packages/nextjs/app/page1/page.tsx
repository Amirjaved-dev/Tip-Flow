"use client";

import Link from "next/link";
import {
    ArrowRightIcon,
    BoltIcon,
    CurrencyDollarIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    GlobeAltIcon,
    RocketLaunchIcon,
    CheckCircleIcon,
    PlusIcon,
    MinusIcon,
    WalletIcon,
    CpuChipIcon,
    ChartBarIcon
} from "@heroicons/react/24/outline";
import { InteractiveTipDemo } from "./_components/InteractiveTipDemo";
import { motion, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion";
import { useState } from "react";



// Animation Variants
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const textReveal: Variants = {
    hidden: { y: "100%" },
    visible: (i: number) => ({
        y: "0%",
        transition: {
            delay: i * 0.05,
            duration: 0.5,
            ease: [0.33, 1, 0.68, 1]
        }
    })
};

// Components
const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
    <motion.div
        variants={fadeInUp}
        className="group p-8 bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
    >
        <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300">
            <Icon className="w-7 h-7 text-gray-900 dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
);

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-100 dark:border-gray-800">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-gray-300 transition-colors">
                    {question}
                </span>
                <span className={`p-2 rounded-full border border-gray-200 dark:border-gray-800 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                    <PlusIcon className="w-5 h-5 text-gray-500" />
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AnimatedText = ({ text, className = "" }: { text: string, className?: string }) => {
    const words = text.split(" ");
    return (
        <span className={`inline-block overflow-hidden ${className}`}>
            {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.2em] -mb-[0.1em] pb-[0.1em]">
                    <motion.span
                        custom={i}
                        variants={textReveal}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="inline-block"
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </span>
    );
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black">
            {/* Background Gradients */}
            {/* Background Gradients Removed */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                {/* Clean background - removed blobs */}
            </div>

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                            <BoltIcon className="w-5 h-5 text-white dark:text-black" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">TipFlow</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        {["Features", "How it Works", "FAQ"].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                        <Link
                            href="/"
                            className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
                        >
                            Launch App
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-28 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={staggerContainer}
                        viewport={{ once: true }}
                        className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm font-medium mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
                            </span>
                            Live on Sepolia Testnet
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
                            <AnimatedText text="Tip anyone." className="block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-400 dark:to-gray-600">
                                <AnimatedText text="Pay nothing" className="inline-block" />
                                <br />
                                <AnimatedText text="in gas fees." className="inline-block" />
                            </span>
                        </h1>

                        <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                            Send USDC micro-tips instantly through state channels. <br className="hidden lg:block" />
                            Your fans tip $0.01, you get $0.01. No middleman.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            <Link
                                href="/"
                                className="group flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full text-base font-bold hover:shadow-xl hover:shadow-black/20 dark:hover:shadow-white/20 transition-all hover:-translate-y-1"
                            >
                                Get Your Tip Link
                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-medium border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                            >
                                See How It Works
                            </Link>
                        </motion.div>


                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative w-full max-w-md mx-auto lg:max-w-full"
                    >
                        <InteractiveTipDemo />
                    </motion.div>
                </div>
            </section>

            {/* Trusted By Marquee */}
            <section className="py-10 border-y border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 overflow-hidden">
                <div className="flex gap-16 items-center animate-marquee whitespace-nowrap">
                    {[1, 2, 3, 4, 1, 2, 3, 4].map((_, i) => (
                        <div key={i} className="flex items-center gap-2 text-xl font-bold text-gray-400 dark:text-gray-600 grayscale hover:grayscale-0 transition-all cursor-default">
                            <span className="w-6 h-6 rounded bg-current opacity-50"></span>
                            <span>PARTNER{i}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">Why creators love TipFlow</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            The first tipping platform designed for the micropayment economy. Stop losing 30% of your income to fees.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        <FeatureCard
                            icon={ShieldCheckIcon}
                            title="Zero Gas Fees"
                            description="We use state channels to process transactions off-chain. You only sign once to deposit, then tip endlessly for free."
                            delay={0}
                        />
                        <FeatureCard
                            icon={BoltIcon}
                            title="Instant Settlement"
                            description="No block confirmations. No waiting. Tips arrive in your smart account in milliseconds."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={CurrencyDollarIcon}
                            title="True Micropayments"
                            description="Finally, sending $0.05 makes economic sense. Unlock new revenue streams from casual fans."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={WalletIcon}
                            title="Smart Wallet"
                            description="Built on Account Abstraction. Login with email, passkeys, or your favorite wallet."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={CpuChipIcon}
                            title="API First"
                            description="Integrate TipFlow into your app, game, or stream overlay with our simple SDK."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={ChartBarIcon}
                            title="Analytics"
                            description="Track your top tippers, revenue growth, and conversion rates in real-time."
                            delay={0.5}
                        />
                    </motion.div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900/30">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold tracking-tight mb-4">Compare the math</h2>
                        <p className="text-gray-500 text-lg">See how much you save on a small tip.</p>
                    </div>

                    <div className="bg-white dark:bg-black rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                                        <th className="p-6 text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Platform</th>
                                        <th className="p-6 text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Tip Amount</th>
                                        <th className="p-6 text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Fees</th>
                                        <th className="p-6 text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">You Keep</th>
                                    </tr>
                                </thead>
                                <tbody className="text-lg">
                                    <tr className="border-b border-gray-100 dark:border-gray-800">
                                        <td className="p-6 font-semibold flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"><GlobeAltIcon className="w-5 h-5" /></span>
                                            Standard Crypto
                                        </td>
                                        <td className="p-6 text-gray-500">$1.00</td>
                                        <td className="p-6 text-gray-500 dark:text-gray-400 font-medium">~$2.50 (Gas)</td>
                                        <td className="p-6 text-gray-400 font-bold">-$1.50 (Loss)</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 dark:border-gray-800">
                                        <td className="p-6 font-semibold flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"><UserGroupIcon className="w-5 h-5" /></span>
                                            Patreon
                                        </td>
                                        <td className="p-6 text-gray-500">$1.00</td>
                                        <td className="p-6 text-gray-500 dark:text-gray-400 font-medium">~$0.35 + 5%</td>
                                        <td className="p-6 text-gray-700 dark:text-gray-300 font-bold">$0.60</td>
                                    </tr>
                                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                                        <td className="p-6 font-semibold flex items-center gap-3 text-black dark:text-white">
                                            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                                                <BoltIcon className="w-5 h-5 text-white dark:text-black" />
                                            </div>
                                            TipFlow
                                        </td>
                                        <td className="p-6 font-medium">$1.00</td>
                                        <td className="p-6 text-black dark:text-white font-bold">$0.00</td>
                                        <td className="p-6 text-black dark:text-white font-black text-xl">$1.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-16">Loved by builders and creators</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Alex Chen",
                                role: "Open Source Maintainer",
                                quote: "I used to lose 50% of my donations to gas fees. With TipFlow, I keep everything. It's a game changer for small contributions."
                            },
                            {
                                name: "Sarah J.",
                                role: "Digital Artist",
                                quote: "The implementation is seamless. My fans love that they don't have to pay $5 gas to send me a $2 tip. It just works."
                            },
                            {
                                name: "Mike Ross",
                                role: "Streamer",
                                quote: "Instant settlement means I see the tip on screen immediately. No waiting for block confirmations. Incredible tech."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white dark:text-black bg-black dark:bg-white`}>
                                        <span className="font-bold text-lg">{item.name[0]}</span>
                                    </div>
                                    <div>
                                        <div className="font-bold">{item.name}</div>
                                        <div className="text-sm text-gray-500">{item.role}</div>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 italic">"{item.quote}"</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-20 text-center">Start earning in minutes</h2>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-800 -z-10" />

                        {[
                            {
                                step: "01",
                                title: "Connect Wallet",
                                description: "Sign in with your Ethereum wallet. No registration required.",
                            },
                            {
                                step: "02",
                                title: "Create Session",
                                description: "Deposit USDC into the state channel. One transaction, zero gas after.",
                            },
                            {
                                step: "03",
                                title: "Share & Earn",
                                description: "Get your unique link and start receiving gasless tips instantly.",
                            },
                        ].map((item, index) => (
                            <div key={index} className="relative pt-8 md:pt-0 group">
                                <div className="w-24 h-24 bg-gray-900 border border-gray-800 group-hover:border-white/50 transition-colors rounded-3xl flex items-center justify-center text-3xl font-bold text-gray-500 mb-8 mx-auto shadow-2xl">
                                    {item.step}
                                </div>
                                <div className="text-center px-4">
                                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/50 pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-500">
                        Ready to join the <br /> micropayment revolution?
                    </h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                        Join thousands of creators who are saving fees and earning more with TipFlow.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 md:px-10 md:py-5 rounded-full text-lg md:text-xl font-bold hover:shadow-2xl hover:-translate-y-1 transition-all"
                        >
                            Start Tipping Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-6 h-6 bg-black dark:bg-white rounded-md flex items-center justify-center">
                                    <BoltIcon className="w-4 h-4 text-white dark:text-black" />
                                </div>
                                <span className="font-bold text-lg">TipFlow</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                The zero-gas tipping protocol for the modern web.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-black dark:hover:text-white">Features</a></li>
                                <li><a href="#" className="hover:text-black dark:hover:text-white">Pricing</a></li>
                                <li><a href="#" className="hover:text-black dark:hover:text-white">SDK</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-black dark:hover:text-white">About</a></li>
                                <li><a href="#" className="hover:text-black dark:hover:text-white">Blog</a></li>
                                <li><a href="#" className="hover:text-black dark:hover:text-white">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-black dark:hover:text-white">Privacy</a></li>
                                <li><a href="#" className="hover:text-black dark:hover:text-white">Terms</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <div className="text-sm text-gray-500">© 2024 TipFlow Protocol. All rights reserved.</div>
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">GitHub</a>
                            <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">Discord</a>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    );
}
