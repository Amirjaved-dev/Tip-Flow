import { useEffect, useState } from "react";
import { createPublicClient, http, isAddress } from "viem";
import { sepolia } from "viem/chains";
import { normalize } from "viem/ens";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/outline";

// Initialize public client for ENS resolution on Sepolia
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

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
    wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
    description: "Mastering Bitcoin & Ethereum.",
    tags: ["Education", "Tech"],
  },
  {
    id: "3",
    name: "Bankless",
    wallet: "0x3c5Aac016EF2F178e8699D6208796A2D67557fe2",
    description: "The ultimate guide to crypto finance.",
    tags: ["Podcast", "DeFi"],
    isLive: true,
  },
  {
    id: "4",
    name: "GitCoin",
    wallet: "0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6",
    description: "Funding public goods.",
    tags: ["Public Goods"],
  },
];

export const CreatorList = ({ onSelectCreator }: CreatorListProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [ensAddress, setEnsAddress] = useState<string | null>(null);
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  // Debounced Name/Address Resolution
  useEffect(() => {
    const resolveInput = async () => {
      if (!searchTerm) {
        setEnsAddress(null);
        setResolvedName(null);
        return;
      }

      setIsResolving(true);
      try {
        // If it looks like an address, try reverse resolution
        if (isAddress(searchTerm)) {
          setEnsAddress(null); // It's already an address
          const name = await publicClient.getEnsName({
            address: searchTerm,
          });
          setResolvedName(name);
        }
        // If it looks like a domain, try forward resolution
        else if ((searchTerm as string).includes(".") && (searchTerm as string).length > 3) {
          setResolvedName(null); // Use input as name
          const normalizedName = normalize(searchTerm as string);
          const address = await publicClient.getEnsAddress({
            name: normalizedName,
          });
          setEnsAddress(address);
        } else {
          setEnsAddress(null);
          setResolvedName(null);
        }
      } catch (error) {
        console.error("Resolution failed:", error);
        setEnsAddress(null);
        setResolvedName(null);
      } finally {
        setIsResolving(false);
      }
    };

    const timeoutId = setTimeout(resolveInput, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredCreators = MOCK_CREATORS.filter(
    creator =>
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const isCustomAddress = isAddress(searchTerm);
  const showCustomOption =
    (isCustomAddress || ensAddress) &&
    !filteredCreators.find(c => c.wallet?.toLowerCase() === (isCustomAddress ? searchTerm : ensAddress)?.toLowerCase());

  // Determine display values
  const displayAddress = isCustomAddress ? searchTerm : ensAddress;
  const displayName = resolvedName || (ensAddress ? searchTerm : "Tip Address");

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-base-content/50" />
        </div>
        <input
          type="text"
          placeholder="Search creator, address, or ENS..."
          className="input input-bordered w-full pl-10 bg-base-200 focus:bg-base-100 transition-colors"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {isResolving && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="loading loading-spinner loading-xs text-primary"></span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {/* Custom Address / ENS Option */}
        {showCustomOption && (
          <div
            onClick={() =>
              onSelectCreator({
                id: "custom",
                name: displayName,
                wallet: displayAddress || "",
                description: resolvedName
                  ? `Resolved ENS: ${resolvedName}`
                  : displayAddress
                    ? `Score: ${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}`
                    : "Tip this specific address",
                tags: resolvedName || ensAddress ? ["ENS"] : ["Custom"],
                isLive: !!(resolvedName || ensAddress),
                ens: resolvedName || (ensAddress ? searchTerm : undefined),
              })
            }
            className="group relative flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 bg-primary/10 hover:bg-primary/20 border border-primary/20"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden text-primary">
                <UserCircleIcon className="w-6 h-6" />
              </div>
              {ensAddress && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-base-100 rounded-full"></span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-base-content">{displayName}</h3>
              <p className="text-xs text-base-content/50 truncate font-mono">{displayAddress}</p>
            </div>
          </div>
        )}

        {/* List of Creators */}
        {filteredCreators.length > 0
          ? filteredCreators.map(creator => (
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
          : !showCustomOption && (
              <div className="text-center py-8 text-base-content/50">
                <p>No creators or ENS found.</p>
              </div>
            )}
      </div>
    </div>
  );
};
