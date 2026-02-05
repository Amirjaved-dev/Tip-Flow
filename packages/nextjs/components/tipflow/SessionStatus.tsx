import { ArrowRightOnRectangleIcon, BoltIcon } from "@heroicons/react/24/outline";

interface SessionStatusProps {
  balance: string;
  totalTipped: string;
  transactionCount: number;
  onEndSession: () => void;
}

export const SessionStatus = ({ balance, totalTipped, transactionCount, onEndSession }: SessionStatusProps) => {
  return (
    <div className="flex items-center gap-6 bg-base-100 rounded-xl px-4 py-3 border border-base-200 shadow-sm">
      {/* Mobile: Condensed view / Desktop: Expanded */}

      <div className="flex items-center gap-6 px-2">
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-base-content/50 font-semibold mb-0.5">Balance</div>
          <div className="font-mono font-bold text-xl leading-none text-base-content">
            ${parseFloat(balance).toFixed(2)}
          </div>
        </div>

        <div className="w-px h-8 bg-base-200 hidden md:block"></div>

        <div className="text-right hidden md:block">
          <div className="text-[10px] uppercase tracking-wider text-base-content/50 font-semibold mb-0.5">Tipped</div>
          <div className="font-mono font-bold text-xl leading-none text-primary">
            ${parseFloat(totalTipped).toFixed(2)}
          </div>
        </div>

        <div className="w-px h-8 bg-base-200 hidden md:block"></div>

        <div className="text-right hidden md:block">
          <div className="text-[10px] uppercase tracking-wider text-base-content/50 font-semibold mb-0.5">Txns</div>
          <div className="font-mono font-bold text-xl leading-none flex items-center justify-end gap-1 text-base-content">
            {transactionCount} <BoltIcon className="w-4 h-4 text-warning" />
          </div>
        </div>
      </div>

      <button
        onClick={onEndSession}
        className="btn btn-sm btn-ghost hover:bg-error/10 text-error font-medium border border-transparent hover:border-error/20"
      >
        <span className="hidden md:inline">End Session</span>
        <ArrowRightOnRectangleIcon className="w-5 h-5 md:hidden" />
      </button>
    </div>
  );
};
