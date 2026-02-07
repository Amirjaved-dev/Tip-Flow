import { useState } from "react";

interface TipControlProps {
  recipientName: string;
  onSendTip: (amount: string) => void;
  disabled?: boolean;
}

export const TipControl = ({ recipientName, onSendTip, disabled }: TipControlProps) => {
  const [customTip, setCustomTip] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleTip = async (amount: string) => {
    if (!disabled && amount && parseFloat(amount) > 0) {
      setIsSending(true);
      try {
        await onSendTip(amount);
        setCustomTip("");
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 max-w-md mx-auto">
      {/* Recipient Info */}
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tipping</p>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{recipientName}</h3>
      </div>

      {/* Quick Amount Buttons */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select Amount
        </label>
        <div className="grid grid-cols-4 gap-3">
          {["1", "5", "10", "20"].map(amount => (
            <button
              key={amount}
              onClick={() => handleTip(amount)}
              disabled={disabled || isSending}
              className="px-4 py-3 rounded-lg font-semibold text-lg transition-all bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount Input */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Custom Amount
        </label>
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
              $
            </span>
            <input
              type="number"
              placeholder="Enter amount"
              value={customTip}
              onChange={e => setCustomTip(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleTip(customTip);
                }
              }}
              disabled={disabled || isSending}
              className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button
            onClick={() => handleTip(customTip)}
            disabled={disabled || !customTip || isSending}
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-95 flex items-center gap-2"
          >
            {isSending ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                Send
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {disabled && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Insufficient balance
          </p>
        </div>
      )}
    </div>
  );
};
