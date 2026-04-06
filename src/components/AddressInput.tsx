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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter a commercial property address..."
          className="w-full pl-12 pr-36 py-4 rounded-xl border border-gray-200 shadow-sm text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent bg-white"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-accent-blue text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors font-sans"
        >
          Generate Memo
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </form>
  );
}
