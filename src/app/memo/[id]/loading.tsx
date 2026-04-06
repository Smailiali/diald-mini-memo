export default function MemoLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-navy rounded-xl px-8 py-7 mb-8">
        <div className="h-3 w-32 bg-white/20 rounded mb-3" />
        <div className="h-6 w-3/4 bg-white/30 rounded mb-2" />
        <div className="h-3 w-24 bg-white/20 rounded" />
      </div>

      {/* Score skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 flex flex-col sm:flex-row items-center gap-8">
        <div className="w-36 h-36 rounded-full bg-gray-100" />
        <div className="flex-1 w-full flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex justify-between">
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-3 w-12 bg-gray-100 rounded" />
              </div>
              <div className="h-2 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Chapter skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 px-8 py-8 mb-8 flex flex-col gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-3 w-28 bg-gray-100 rounded" />
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-5/6 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
