"use client";

import { useEffect, useState } from "react";
import { getAddress, isAddress } from "viem";
import { useEnsAvatar, useEnsName } from "wagmi";
import { ArrowTopRightOnSquareIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useCopyToClipboard, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

type AddressProps = {
  address?: string;
  disableAddressLink?: boolean;
  format?: "short" | "long";
  size?: "xs" | "sm" | "base" | "lg" | "xl";
};

/**
 * Displays an address (or ENS) with a Blockie image and option to copy address.
 */
export const Address = ({ address, disableAddressLink, format, size = "base" }: AddressProps) => {
  const [ens, setEns] = useState<string | null>(null);
  const [ensAvatar, setEnsAvatar] = useState<string | null>(null);
  const { targetNetwork } = useTargetNetwork();

  const checkSumAddress = address ? getAddress(address) : undefined;

  const { data: fetchedEns } = useEnsName({
    address: checkSumAddress,
    chainId: 1, // Only mainnet for ENS
  });

  const { data: fetchedEnsAvatar } = useEnsAvatar({
    name: fetchedEns || undefined,
    chainId: 1,
  });

  // We need to apply this pattern to avoid Hydration issues.
  useEffect(() => {
    setEns(fetchedEns);
  }, [fetchedEns]);

  useEffect(() => {
    setEnsAvatar(fetchedEnsAvatar);
  }, [fetchedEnsAvatar]);

  const { copyToClipboard, isCopiedToClipboard } = useCopyToClipboard();

  // Skeleton UI
  if (!checkSumAddress) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAddress(checkSumAddress)) {
    return <span className="text-error">Wrong address</span>;
  }

  const blockExplorerAddressLink = getBlockExplorerAddressLink(targetNetwork, checkSumAddress);
  let displayAddress = checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4);

  if (ens) {
    displayAddress = ens;
  } else if (format === "long") {
    displayAddress = checkSumAddress;
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex-shrink-0">
        <BlockieAvatar
          address={checkSumAddress}
          ensImage={ensAvatar || undefined}
          size={size === "xs" || size === "sm" ? 24 : 30}
        />
      </div>

      {disableAddressLink ? (
        <span className={`ml-1.5 text-${size} font-normal`}>{displayAddress}</span>
      ) : (
        <a
          className={`ml-1.5 text-${size} font-normal`}
          target="_blank"
          href={blockExplorerAddressLink}
          rel="noopener noreferrer"
        >
          {displayAddress}
        </a>
      )}

      {/* Copy Icon */}
      {isCopiedToClipboard ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <DocumentDuplicateIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
          onClick={() => copyToClipboard(checkSumAddress)}
        />
      )}
    </div>
  );
};
