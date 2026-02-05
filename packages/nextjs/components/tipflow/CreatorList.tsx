import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { UserCircleIcon } from "@heroicons/react/24/outline";

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
  return (
    <div className="space-y-2">
      {MOCK_CREATORS.map(creator => (
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
      ))}
    </div>
  );
};
