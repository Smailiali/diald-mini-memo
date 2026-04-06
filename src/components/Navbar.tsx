import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-navy border-b border-white/10">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-white font-bold text-base font-sans tracking-tight hover:text-blue-200 transition-colors"
        >
          Mini Memo
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-blue-200 hover:text-white transition-colors font-sans"
          >
            New Memo
          </Link>
          <Link
            href="/history"
            className="text-sm text-blue-200 hover:text-white transition-colors font-sans"
          >
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}
