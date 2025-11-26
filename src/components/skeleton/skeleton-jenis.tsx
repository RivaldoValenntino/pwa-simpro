export const SkeletonListJenis = () => {
  const skeletonItems = Array(6).fill(null); // jumlah item sementara

  return (
    <div className="w-full p-4 overflow-hidden shadow-none bg-whiteCust rounded-xl">
      {/* Header Skeleton */}
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
      <div className="w-full h-48 my-4 bg-white rounded-md shadow-none"></div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {skeletonItems.map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center p-3 text-center bg-white rounded-md shadow-none"
          >
            <div className="flex items-center justify-center w-20 h-20 mb-2 bg-gray-200 rounded-lg animate-pulse" />

            <div className="w-full h-4 mb-2 bg-gray-200 rounded-full animate-pulse" />

            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};
