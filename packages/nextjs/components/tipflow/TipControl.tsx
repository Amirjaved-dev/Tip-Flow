import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface TipControlProps {
  recipientName: string;
  onSendTip: (amount: string) => void;
  disabled?: boolean;
}

export const TipControl = ({ recipientName, onSendTip, disabled }: TipControlProps) => {
  const [customTip, setCustomTip] = useState("");

  const handleTip = (amount: string) => {
    if (!disabled) {
      onSendTip(amount);
      setCustomTip("");
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-6">
      <div className="text-center mb-8">
        <h3 className="text-xs uppercase tracking-widest text-base-content/50 mb-2 font-medium">Sending to</h3>
        <p className="text-3xl font-bold text-base-content tracking-tight">{recipientName}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-6">
        {["1", "5", "10", "20"].map(amount => (
          <button
            key={amount}
            onClick={() => handleTip(amount)}
            disabled={disabled}
            className="btn btn-lg bg-base-100 border border-base-200 hover:border-primary hover:bg-primary/5 hover:text-primary text-xl font-medium shadow-sm transition-all duration-200 rounded-xl"
          >
            ${amount}
          </button>
        ))}
      </div>

      <div className="w-full max-w-xs relative group">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-base-content/40 font-medium">$</span>
          <input
            type="number"
            placeholder="Custom amount"
            value={customTip}
            onChange={e => setCustomTip(e.target.value)}
            disabled={disabled}
            className="input w-full pl-8 pr-12 bg-base-100 border-base-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 rounded-xl h-12 transition-all shadow-sm"
          />
          <button
            onClick={() => handleTip(customTip)}
            disabled={disabled || !customTip}
            className="absolute right-1 btn btn-sm btn-primary rounded-lg w-10 h-10 min-h-0 border-none shadow-sm"
          >
            <PaperAirplaneIcon className="w-4 h-4 -rotate-45 translate-x-px -translate-y-px" />
          </button>
        </div>
      </div>

      {disabled && (
        <p className="text-error text-xs mt-4 font-medium flex items-center gap-1 bg-error/10 px-3 py-1 rounded-full">
          Insufficent Balance
        </p>
      )}
    </div>
  );
};
