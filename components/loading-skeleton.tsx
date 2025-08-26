export function ProductCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-700 rounded w-1/3" />
        <div className="h-5 bg-gray-700 rounded w-2/3" />
        <div className="h-3 bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-700 rounded w-3/4" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-700 rounded w-1/3" />
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-gray-700 rounded" />
            <div className="h-8 w-8 bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductListSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-48 h-48 bg-gray-700 rounded-md flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-700 rounded w-1/4" />
          <div className="h-6 bg-gray-700 rounded w-1/2" />
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-3/4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 bg-gray-700 rounded w-24" />
              <div className="h-6 bg-gray-700 rounded w-20" />
            </div>
            <div className="flex gap-3">
              <div className="h-8 w-8 bg-gray-700 rounded" />
              <div className="h-8 w-24 bg-gray-700 rounded" />
              <div className="h-8 w-28 bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
