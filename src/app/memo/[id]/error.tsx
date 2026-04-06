"use client";

import Link from "next/link";

export default function MemoError() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider font-sans mb-2">
        Error
      </p>
      <h1 className="text-2xl font-bold text-navy font-sans mb-3">
        Could not load memo
      </h1>
      <p className="text-gray-500 font-sans text-sm mb-6">
        Something went wrong while fetching this memo. Please try again.
      </p>
      <Link
        href="/"
        className="inline-block px-5 py-2.5 bg-accent-blue text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors font-sans"
      >
        Back to Home
      </Link>
    </div>
  );
}
