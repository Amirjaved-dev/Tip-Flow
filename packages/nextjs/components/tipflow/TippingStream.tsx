"use client";

import { useEffect, useState } from "react";

interface TipEvent {
  id: string;
  sender: string;
  recipient: string;
  amount: string;
  timestamp: number;
}

const MOCK_TIPS: TipEvent[] = [
  { id: "1", sender: "You", recipient: "vitalik.eth", amount: "0.50", timestamp: Date.now() - 5000 },
  { id: "2", sender: "You", recipient: "hayden.eth", amount: "1.00", timestamp: Date.now() - 15000 },
];

export const TippingStream = () => {
  const [tips, setTips] = useState<TipEvent[]>(MOCK_TIPS);

  // Auto-add mock tips for demo effect
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance to add a random tip from "someone else"
      if (Math.random() > 0.9) {
        const newTip = {
          id: Date.now().toString(),
          sender: "anon.eth",
          recipient: ["vitalik.eth", "hayden.eth", "nick.eth", "sassal.eth"][Math.floor(Math.random() * 4)],
          amount: (Math.random() * 2).toFixed(2),
          timestamp: Date.now(),
        };
        setTips(prev => [newTip, ...prev].slice(0, 10));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-4 rounded-xl h-full min-h-[300px] flex flex-col">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
        </span>
        Live Activity
      </h3>

      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {tips.map(tip => (
          <div
            key={tip.id}
            className="flex items-center justify-between p-3 rounded-lg bg-base-100/40 animate-fade-in-left border-l-4 border-success"
          >
            <div>
              <p className="text-sm font-medium">
                <span className="text-primary">{tip.sender}</span> tipped{" "}
                <span className="text-secondary">{tip.recipient}</span>
              </p>
              <p className="text-xs text-base-content/50">{new Date(tip.timestamp).toLocaleTimeString()}</p>
            </div>
            <div className="badge badge-success badge-outline font-mono">+${tip.amount}</div>
          </div>
        ))}

        {tips.length === 0 && (
          <div className="text-center text-base-content/30 py-10">No tips yet... be the first!</div>
        )}
      </div>
    </div>
  );
};
