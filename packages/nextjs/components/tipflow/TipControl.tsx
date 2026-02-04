"use client";

import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface TipControlProps {
  recipientName: string;
  onSendTip: (amount: string) => void;
  disabled?: boolean;
}

const PRESET_AMOUNTS = ["0.10", "0.50", "1.00", "5.00"];

export const TipControl = ({ recipientName, onSendTip, disabled }: TipControlProps) => {
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (amt: string) => {
    if (!amt || disabled) return;
    setLoading(true);
    // Simulate delay
    await new Promise(r => setTimeout(r, 600));
    onSendTip(amt);
    setLoading(false);
    setCustomAmount("");
  };

  return (
    <div className="glass-panel p-6 rounded-xl animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-lg text-base-content/70">Tipping</h3>
        <h2 className="text-3xl font-bold text-primary">{recipientName}</h2>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {PRESET_AMOUNTS.map(amt => (
          <button
            key={amt}
            disabled={disabled || loading}
            onClick={() => handleSend(amt)}
            className="btn btn-outline btn-primary btn-sm hover:glass-btn"
          >
            ${amt}
          </button>
        ))}
      </div>

      <div className="join w-full mb-4">
        <span className="join-item btn btn-static bg-base-200 border-base-300">$</span>
        <input
          type="number"
          value={customAmount}
          onChange={e => setCustomAmount(e.target.value)}
          placeholder="Custom amount"
          className="join-item input input-bordered w-full text-center focus:border-secondary"
          disabled={disabled || loading}
        />
      </div>

      <button
        disabled={disabled || loading || !customAmount}
        onClick={() => handleSend(customAmount)}
        className={`btn btn-secondary w-full text-lg shadow-lg hover:shadow-secondary/50 ${loading ? "loading" : ""}`}
      >
        {!loading && <PaperAirplaneIcon className="w-5 h-5 mr-2" />}
        Send Tip
      </button>
    </div>
  );
};
