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
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
            </span>
            Ready to tip
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
            Initialize Your Session
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Deposit once, tip endlessly. Unused funds are automatically refunded when you end the session.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {/* Amount Selection Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 mb-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all">
            <div className="space-y-6">
              {/* Label with Icon */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Deposit Amount</h2>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {["10", "50", "100"].map(val => (
                  <button
                    key={val}
                    onClick={() => {
                      setAmount(val);
                      setCustomAmount("");
                    }}
                    className={`
                      px-5 py-4 rounded-lg font-semibold text-base transition-all duration-200
                      ${
                        amount === val && !customAmount
                          ? "bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white shadow-sm"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    ${val}
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Or enter custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold text-lg">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        handleStart();
                      }
                    }}
                    className="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 text-lg font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  One-time approval required
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                  You'll sign one transaction to deposit funds. After that, all tips are completely gasless and instant.
                </p>
              </div>
            </div>
          </div>

          {/* Create Session Button */}
          <button
            onClick={handleStart}
            disabled={isLoading || parseFloat(customAmount || amount) <= 0}
            className="w-full px-6 py-5 bg-black dark:bg-white text-white dark:text-black font-semibold text-lg rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Session...
              </span>
            ) : (
              "Create Session"
            )}
          </button>

          {/* Additional Info */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Your deposit is secure and can be withdrawn at any time
          </p>
        </div>
      </div>
    </div>
  );
};
