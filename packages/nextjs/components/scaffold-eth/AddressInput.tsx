"use client";

import { useEffect, useState } from "react";
import { getAddress, isAddress } from "viem";
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
  // We'll treat the internal value as what the user types (which might be ENS)
  // But we pass the resolved/validated address/ENS string to parent?
  // Standard pattern: Parent controls value.

  // Actually, usually parents expect the raw value or the resolved address?
  // Let's stick to: value is what the user typed.

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

  return (
    <div className="form-control w-full">
      <div className="relative">
        <input
          name={name}
          type="text"
          placeholder={placeholder}
          className={`input input-bordered w-full pr-12 ${isEnsName && ensAddress ? "input-success" : ""} ${!isEnsName && isAddress(value) ? "input-success" : ""} ${value && !isEnsName && !isAddress(value) ? "input-error" : ""}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          autoComplete="off"
        />

        {/* Avatar Preview */}
        {value && (isAddress(value) || ensAddress) && (
          <div className="absolute top-2 right-2 flex items-center gap-2 pointer-events-none">
            <span className="text-xs text-base-content/50 hidden sm:block">
              {ensAddress ? ensAddress.slice(0, 6) + "..." + ensAddress.slice(-4) : ""}
            </span>
            <BlockieAvatar address={ensAddress || value} ensImage={ensAvatar || undefined} size={30} />
          </div>
        )}
      </div>
    </div>
  );
};
