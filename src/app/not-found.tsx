import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-light-gray flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider font-sans mb-2">
          404
        </p>
        <h1 className="text-2xl font-bold text-navy font-sans mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 font-sans text-sm mb-6">
          The memo or page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-accent-blue text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors font-sans"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
