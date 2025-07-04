export default function MyItemsLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF4E6" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
            </div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center"
            >
              <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse" />
            </div>
          ))}
        </div>

        {/* Items Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-10 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
