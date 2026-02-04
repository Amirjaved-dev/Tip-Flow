"use client";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

interface SessionStatusProps {
  balance: string;
  totalTipped: string;
  transactionCount: number;
  onEndSession: () => void;
}

export const SessionStatus = ({ balance, totalTipped, transactionCount, onEndSession }: SessionStatusProps) => {
  return (
    <div className="glass-panel p-4 rounded-xl flex items-center justify-between mb-6 bg-gradient-to-r from-base-100 to-base-200">
      <div className="flex gap-6">
        <div>
          <p className="text-xs text-base-content/50 uppercase tracking-widest font-bold">Balance</p>
          <p className="text-2xl font-mono font-bold text-success">${balance}</p>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs text-base-content/50 uppercase tracking-widest font-bold">Total Tipped</p>
          <p className="text-2xl font-mono font-bold">${totalTipped}</p>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs text-base-content/50 uppercase tracking-widest font-bold">Tx Count</p>
          <p className="text-2xl font-mono font-bold">#{transactionCount}</p>
        </div>
      </div>

      <button onClick={onEndSession} className="btn btn-error btn-outline btn-sm hover:btn-active gap-2">
        <ArrowRightOnRectangleIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Settle & Close</span>
        <span className="sm:hidden">Exit</span>
      </button>
    </div>
  );
};
