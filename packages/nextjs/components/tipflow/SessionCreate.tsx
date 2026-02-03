"use client";

import { useState } from "react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

export const SessionCreate = ({ onStartSession }: { onStartSession: (amount: string) => void }) => {
  const [amount, setAmount] = useState("10");

  return (
    <div className="card glass-panel w-full max-w-md mx-auto p-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Start Tipping Session
      </h2>
      <p className="text-center text-base-content/70 mb-6">Lock funds once, tip instantly with 0 gas.</p>

      <div className="form-control w-full mb-6">
        <label className="label">
          <span className="label-text">Session Budget (USDC)</span>
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="input input-bordered w-full pl-10 text-lg font-mono focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="0.00"
          />
          <CurrencyDollarIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
        </div>
      </div>

      <button
        onClick={() => onStartSession(amount)}
        className="btn btn-primary w-full shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:-translate-y-0.5"
      >
        <span className="text-lg">Activate Session</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 ml-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>

      <div className="mt-4 text-xs text-center text-base-content/50">
        Funds are locked in a secure state channel. <br /> Unused funds are returned when you end execution.
      </div>
    </div>
  );
};
