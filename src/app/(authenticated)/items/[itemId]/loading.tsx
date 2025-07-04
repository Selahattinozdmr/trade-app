export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header skeleton */}
      <div className="bg-white shadow-sm border-b border-gray-200 animate-pulse">
        <div className="px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-32" />
            <div className="flex items-center space-x-4">
              <div className="h-8 bg-gray-200 rounded w-24" />
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
            {/* Image skeleton */}
            <div className="aspect-[16/9] bg-gray-200" />

            {/* Content skeleton */}
            <div className="p-8">
              {/* Title skeleton */}
              <div className="h-8 bg-gray-200 rounded mb-4" />

              {/* Description skeleton */}
              <div className="mb-6">
                <div className="h-6 bg-gray-200 rounded mb-3 w-24" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>

              {/* Details grid skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div>
                      <div className="h-3 bg-gray-200 rounded mb-1 w-16" />
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons skeleton */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <div className="flex-1 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1 h-12 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
