import { useState } from "react";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

interface SessionCreateProps {
  onStartSession: (amount: string) => void;
}

export const SessionCreate = ({ onStartSession }: SessionCreateProps) => {
  const [amount, setAmount] = useState<string>("50");
  const [customAmount, setCustomAmount] = useState<string>("");

  const handleStart = () => {
    const finalAmount = customAmount || amount;
    if (parseFloat(finalAmount) > 0) {
      onStartSession(finalAmount);
    }
  };

  return (
    <div className="bg-base-100 p-8 rounded-2xl border border-base-200 shadow-xl w-full max-w-md mx-auto relative overflow-hidden">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary shadow-sm border border-primary/10">
          <CurrencyDollarIcon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-base-content tracking-tight">Start Session</h2>
        <p className="text-base-content/60 text-sm mt-2 max-w-xs mx-auto">
          Lock USDC to start tipping. <br /> Unused funds are returned safely.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="label pt-0">
            <span className="label-text font-medium text-xs uppercase tracking-wider text-base-content/50">
              Select Budget
            </span>
          </label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {["10", "50", "100"].map(val => (
              <button
                key={val}
                onClick={() => {
                  setAmount(val);
                  setCustomAmount("");
                }}
                className={`btn ${
                  amount === val && !customAmount
                    ? "btn-primary shadow-md ring-2 ring-primary/20"
                    : "bg-base-100 border-base-200 hover:border-primary/50 text-base-content hover:bg-base-50"
                } transition-all rounded-xl`}
              >
                ${val}
              </button>
            ))}
          </div>

          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 font-medium">$</span>
            <input
              type="number"
              placeholder="Custom Amount"
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              className="input w-full pl-8 bg-base-100 border-base-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 rounded-xl transition-all shadow-sm"
            />
          </div>
        </div>

        <button
          onClick={handleStart}
          className="btn btn-primary w-full btn-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 rounded-xl"
        >
          Initialize Session
        </button>

        <p className="text-xs text-center text-base-content/40 flex items-center justify-center gap-1">
          Powered by <span className="font-semibold text-base-content/60">Yellow Network</span>
        </p>
      </div>
    </div>
  );
};
