"use client";

import { useEffect, useState } from "react";
import { isAddress } from "viem";
import { normalize } from "viem/ens";
import { useEnsAddress, useEnsAvatar } from "wagmi";
import { BlockieAvatar } from "~~/components/scaffold-eth";

type AddressInputProps = {
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
};

// Common debouncer hook could be useful, but keeping it simple inside for now
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

/**
 * Input component that handles ENS resolution and address validation.
 */
export const AddressInput = ({ value, name, placeholder, onChange, disabled }: AddressInputProps) => {
  const debouncedValue = useDebounce(value, 500);
  const isEnsName = debouncedValue.indexOf(".") > -1;

  const { data: ensAddress } = useEnsAddress({
    name: isEnsName ? normalize(debouncedValue) : undefined,
    chainId: 1,
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: isEnsName ? normalize(debouncedValue) : undefined,
    chainId: 1,
  });

  const isInvalid = value.length > 0 && !isEnsName && !isAddress(value);
  const isValid = (isEnsName && ensAddress) || (!isEnsName && isAddress(value));

  return (
    <div className="w-full relative group">
      <input
        name={name}
        type="text"
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-base-100 border text-base-content rounded-xl transition-all outline-none
          ${
            isInvalid
              ? "border-error focus:ring-1 focus:ring-error"
              : isValid
                ? "border-success/50 focus:border-success focus:ring-1 focus:ring-success/20"
                : "border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
          }
          placeholder:text-base-content/40 disabled:bg-base-200 disabled:text-base-content/40 font-mono text-sm
        `}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        autoComplete="off"
      />

      {/* Avatar Preview */}
      {value && (isAddress(value) || ensAddress) && (
        <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-2 pointer-events-none p-1 bg-base-100 rounded-lg border border-base-200 shadow-sm">
          <span className="text-xs text-base-content/50 hidden sm:block font-mono px-1">
            {ensAddress ? ensAddress.slice(0, 6) + "..." + ensAddress.slice(-4) : ""}
          </span>
          <BlockieAvatar address={ensAddress || value} ensImage={ensAvatar || undefined} size={24} />
        </div>
      )}
    </div>
  );
};
