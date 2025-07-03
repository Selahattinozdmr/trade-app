export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-12">
          <div className="w-64 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
          <div className="w-96 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col gap-4">
            <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex gap-4">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-24 h-12 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                <div className="ml-4 flex-1">
                  <div className="w-20 h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Listings Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
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
        </div>
      </main>
    </div>
  );
}
