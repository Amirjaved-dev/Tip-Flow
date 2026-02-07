"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BoltIcon, CurrencyDollarIcon, UserCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export const InteractiveTipDemo = () => {
    const [tipAmount, setTipAmount] = useState(5);
    const [isTipping, setIsTipping] = useState(false);

    const handleTip = () => {
        setIsTipping(true);
        setTimeout(() => setIsTipping(false), 2000);
    };

    return (
        <div className="relative group w-full max-w-sm mx-auto">
            <div className="relative bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 md:mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                            <UserCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Sarah Creator</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">@sarah_art</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
                        <ShieldCheckIcon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Gasless</span>
                    </div>
                </div>

                {/* Amount */}
                <div className="flex flex-col items-center justify-center mb-8 md:mb-10">
                    <div className="relative flex items-baseline text-gray-900 dark:text-white">
                        <span className="text-3xl md:text-4xl font-medium absolute -left-4 md:-left-6 top-1 md:top-2">$</span>
                        <span className="text-5xl md:text-7xl font-bold tracking-tighter">{(tipAmount / 100).toFixed(2)}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[10px]">USD Coin</p>
                </div>

                {/* Slider */}
                <div className="mb-10 px-1">
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={tipAmount}
                        onChange={(e) => setTipAmount(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white hover:accent-gray-700 dark:hover:accent-gray-300 transition-all"
                    />
                    <div className="flex justify-between mt-4 text-[10px] font-semibold text-gray-400 tracking-wider uppercase">
                        <span>$0.01</span>
                        <span>$1.00</span>
                    </div>
                </div>

                {/* Button */}
                <button
                    onClick={handleTip}
                    disabled={isTipping}
                    className="w-full bg-black dark:bg-white text-white dark:text-black h-14 rounded-2xl font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-80 disabled:cursor-not-allowed relative overflow-hidden flex items-center justify-center gap-2 group-hover:shadow-lg dark:shadow-white/5"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {isTipping ? "Sending..." : "Send Tip"}
                        {!isTipping && <BoltIcon className="w-4 h-4" />}
                    </span>
                    {isTipping && (
                        <motion.div
                            className="absolute inset-0 bg-gray-800 dark:bg-gray-200"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, ease: "linear" }}
                        />
                    )}
                </button>

                {/* Success Overlay */}
                <AnimatePresence>
                    {isTipping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white dark:bg-black z-20 flex flex-col items-center justify-center"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mb-6 text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/10"
                            >
                                <CurrencyDollarIcon className="w-8 h-8" />
                            </motion.div>
                            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sent!</h4>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Free & Instant</p>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};
