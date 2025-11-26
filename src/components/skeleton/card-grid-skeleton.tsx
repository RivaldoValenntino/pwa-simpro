export default function CardGridSkeleton() {
  return (
    <>
      {/* Header waktu */}
      <div className="flex items-center justify-between p-4 mb-4 bg-white rounded-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-10 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      {/* Kubikasi */}
      <div className="flex items-center justify-between h-12 px-2 mb-4 bg-gray-300 rounded-md animate-pulse"></div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center p-4 bg-white shadow animate-pulse rounded-xl"
          >
            <div className="w-12 h-12 mb-4 bg-gray-300 rounded-md"></div>
            <div className="w-24 h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </>
  );
}
