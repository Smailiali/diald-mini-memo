"use client";

import { useState } from "react";

interface AddressInputProps {
  onSubmit: (address: string) => void;
}

export default function AddressInput({ onSubmit }: AddressInputProps) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) {
      setError("Please enter a property address.");
      return;
    }
    setError("");
    onSubmit(address.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter a commercial property address..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
        />
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-accent-blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-150"
        >
          Generate Memo
        </button>
      </div>
    </form>
  );
}
