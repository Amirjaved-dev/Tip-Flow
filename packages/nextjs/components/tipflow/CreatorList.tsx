"use client";

import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface Creator {
  id: string;
  name: string;
  ens?: string;
  description: string;
  avatar?: string;
  wallet?: string;
}

const MOCK_CREATORS: Creator[] = [
  { id: "1", name: "Vitalik Buterin", ens: "vitalik.eth", description: "Ethereum Co-founder" },
  { id: "2", name: "Hayden Adams", ens: "hayden.eth", description: "Uniswap Inventor" },
  { id: "3", name: "Stani Kulechov", ens: "stani.eth", description: "Lens Protocol Founder" },
  { id: "4", name: "Linda Xie", ens: "linda.eth", description: "Scalar Capital" },
];

export const CreatorList = ({ onSelectCreator }: { onSelectCreator: (creator: Creator) => void }) => {
  const [search, setSearch] = useState("");

  const filteredCreators = MOCK_CREATORS.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.ens && c.ens.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="w-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search creators or ENS..."
          className="input input-bordered w-full bg-base-100/50 backdrop-blur-sm focus:bg-base-100 transition-colors"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCreators.map(creator => (
          <div
            key={creator.id}
            onClick={() => onSelectCreator(creator)}
            className="flex items-center gap-4 p-4 rounded-xl border border-base-content/5 bg-base-100/30 hover:bg-base-100/60 hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-12 group-hover:ring-2 ring-primary transition-all">
                {creator.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={creator.avatar} alt={creator.name} />
                ) : (
                  <UserCircleIcon className="w-12 h-12 text-base-content/30" />
                )}
              </div>
            </div>
            <div>
              <h3 className="font-bold group-hover:text-primary transition-colors">{creator.name}</h3>
              <p className="text-xs text-base-content/60">{creator.ens || "0x..."}</p>
              <p className="text-xs text-base-content/40 mt-1">{creator.description}</p>
            </div>
            <button className="btn btn-sm btn-circle btn-ghost ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Tip
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
