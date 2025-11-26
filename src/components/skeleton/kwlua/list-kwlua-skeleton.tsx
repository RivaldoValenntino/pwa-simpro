import KwluaCardSkeleton from "./kwlua-skeleton";

const KwluaSkeletonListData = () => {
  return (
    <div className="w-full p-4 overflow-hidden shadow-xs bg-whiteCust rounded-xl">
      {/* Header waktu */}
      <div className="flex items-center justify-between p-4 bg-white rounded-md mb-4">
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
      <div className="flex justify-between items-center px-2 mb-4 bg-white animate-pulse rounded-md h-16"></div>

      {/* Skeleton cards */}
      {[...Array(4)].map((_, idx) => (
        <KwluaCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export default KwluaSkeletonListData;
