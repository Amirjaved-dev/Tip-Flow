import { useState } from "react";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { UserCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { isAddress } from "viem";

interface Creator {
  id: string;
  name: string;
  address?: string;
  wallet?: string;
  ens?: string;
  description?: string;
  avatar?: string;
  tags?: string[];
  isLive?: boolean;
}

interface CreatorListProps {
  onSelectCreator: (creator: Creator) => void;
}

const MOCK_CREATORS: Creator[] = [
  {
    id: "1",
    name: "Vitalik Buterin",
    wallet: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    description: "Building the future of Ethereum.",
    tags: ["Core Dev", "Education"],
    isLive: true,
  },
  {
    id: "2",
    name: "Andreas M.",
    wallet: "0x123...456", // Placeholder or real
    description: "Mastering Bitcoin & Ethereum.",
    tags: ["Education", "Tech"],
  },
  {
    id: "3",
    name: "Bankless",
    wallet: "0x456...789",
    description: "The ultimate guide to crypto finance.",
    tags: ["Podcast", "DeFi"],
    isLive: true,
  },
  {
    id: "4",
    name: "GitCoin",
    wallet: "0x789...012",
    description: "Funding public goods.",
    tags: ["Public Goods"],
  },
];

export const CreatorList = ({ onSelectCreator }: CreatorListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCreators = MOCK_CREATORS.filter(creator =>
    creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isCustomAddress = isAddress(searchTerm);
  const showCustomOption = isCustomAddress && !filteredCreators.find(c => c.wallet?.toLowerCase() === searchTerm.toLowerCase());

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-base-content/50" />
        </div>
        <input
          type="text"
          placeholder="Search creator or paste address..."
          className="input input-bordered w-full pl-10 bg-base-200 focus:bg-base-100 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {/* Custom Address Option */}
        {showCustomOption && (
          <div
            onClick={() => onSelectCreator({
              id: "custom",
              name: "Custom Address",
              wallet: searchTerm,
              description: "Tip this specific address",
              tags: ["Custom"],
            })}
            className="group relative flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 bg-primary/10 hover:bg-primary/20 border border-primary/20"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden text-primary">
                <UserCircleIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-base-content">Tip Address</h3>
              <p className="text-xs text-base-content/50 truncate font-mono">{searchTerm}</p>
            </div>
          </div>
        )}

        {/* List of Creators */}
        {filteredCreators.length > 0 ? (
          filteredCreators.map(creator => (
            <div
              key={creator.id}
              onClick={() => onSelectCreator(creator)}
              className="group relative flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-base-200 border border-transparent hover:border-base-300"
            >
              {/* Avatar / Icon */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center overflow-hidden border border-base-200 text-base-content/50">
                  <UserCircleIcon className="w-6 h-6" />
                </div>
                {creator.isLive && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-base-100 rounded-full"></span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-semibold text-sm text-base-content truncate">{creator.name}</h3>
                  {creator.isLive && <CheckBadgeIcon className="w-3.5 h-3.5 text-primary" />}
                </div>
                <p className="text-xs text-base-content/50 truncate pr-4">{creator.description}</p>
              </div>

              {/* Tags */}
              <div className="hidden sm:block">
                {creator.tags?.slice(0, 1).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-md text-[10px] uppercase font-semibold bg-base-200 text-base-content/60 border border-base-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          !showCustomOption && (
            <div className="text-center py-8 text-base-content/50">
              <p>No creators found.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
