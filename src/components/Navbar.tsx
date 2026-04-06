"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  function linkClass(href: string): string {
    const isActive = pathname === href;
    return isActive
      ? "text-sm text-white font-medium font-sans transition-colors"
      : "text-sm text-blue-200 hover:text-white font-sans transition-colors";
  }

  return (
    <nav className="bg-navy border-b border-white/10 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-white font-bold text-base font-sans tracking-tight hover:text-blue-200 transition-colors"
        >
          Mini Memo
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className={linkClass("/")}>
            New Memo
          </Link>
          <Link href="/history" className={linkClass("/history")}>
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}
