export default function HistoryLoading() {
  return (
    <main className="min-h-screen bg-light-gray px-4 py-12">
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-7 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="h-9 w-24 bg-gray-200 rounded-lg" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div className="flex flex-col gap-1.5">
                <div className="h-4 w-64 bg-gray-100 rounded" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
              <div className="h-6 w-16 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
