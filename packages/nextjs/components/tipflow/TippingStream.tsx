import { useEffect, useState } from "react";

interface TipEvent {
  id: string;
  sender: string;
  recipient: string;
  amount: string;
  timestamp: number;
}

// Mock Stream Generator
const NAMES = ["Anonymous", "CryptoFan", "WAGMI_User", "BasedBuilder", "EthWhale"];
const RECIPIENTS = ["Vitalik", "Bankless", "GitCoin", "Andreas"];

export const TippingStream = () => {
  const [events, setEvents] = useState<TipEvent[]>([
    // Initial mock data to populate view
    { id: "1", sender: "CryptoFan", recipient: "Vitalik", amount: "5.00", timestamp: Date.now() - 5000 },
    { id: "2", sender: "Anonymous", recipient: "Bankless", amount: "10.00", timestamp: Date.now() - 15000 },
  ]);

  useEffect(() => {
    // Simulate live tips coming in from the network
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newEvent: TipEvent = {
          id: Math.random().toString(36).substr(2, 9),
          sender: NAMES[Math.floor(Math.random() * NAMES.length)],
          recipient: RECIPIENTS[Math.floor(Math.random() * RECIPIENTS.length)],
          amount: (Math.random() * 10 + 1).toFixed(2),
          timestamp: Date.now(),
        };

        setEvents(prev => [newEvent, ...prev].slice(0, 20)); // Keep last 20
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-base-200 mb-2">
        <h3 className="font-bold text-lg text-base-content">Recent Tippers</h3>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-success/10 text-success flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          Live
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 pb-4">
        {events.length === 0 && (
          <div className="h-32 flex items-center justify-center text-base-content/40 text-sm italic border border-dashed border-base-300 rounded-xl mt-4">
            Waiting for tips...
          </div>
        )}

        {events.map(event => (
          <div
            key={event.id}
            className="group flex items-center gap-4 p-3 rounded-xl bg-base-100 border border-base-200 hover:border-primary/30 hover:shadow-md transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold border border-primary/5">
              {event.sender[0]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-sm font-semibold text-base-content">{event.sender}</p>
                <span className="text-xs text-base-content/40 font-mono">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-xs text-base-content/60 truncate">
                Sent <span className="font-medium text-base-content/80 text-success">${event.amount}</span> to{" "}
                <span className="font-medium text-base-content/80">{event.recipient}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
