import { useState } from "react";

interface SessionCreateProps {
  onStartSession: (amount: string) => void;
}

export const SessionCreate = ({ onStartSession }: SessionCreateProps) => {
  const [amount, setAmount] = useState<string>("50");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    const finalAmount = customAmount || amount;
    if (parseFloat(finalAmount) > 0) {
      setIsLoading(true);
      try {
        await onStartSession(finalAmount);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-700">
              <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Initialize Session
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-sm mx-auto">
              Deposit once, tip endlessly. <br />
              Unused funds are refunded when you end the session.
            </p>
          </div>

          {/* Amount Selection */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Deposit Amount
              </label>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {["10", "50", "100"].map(val => (
                  <button
                    key={val}
                    onClick={() => {
                      setAmount(val);
                      setCustomAmount("");
                    }}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${amount === val && !customAmount
                        ? "bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                      }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                  $
                </span>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  className="w-full pl- 8 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>

            {/* Create Session Button */}
            <button
              onClick={handleStart}
              disabled={isLoading}
              className="w-full px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-98"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Session...
                </span>
              ) : (
                "Create Session"
              )}
            </button>

            {/* Info Text */}
            <div className="pt-4 space-y-2">
              <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  One-time approval required. After that, all tips are gasless.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
