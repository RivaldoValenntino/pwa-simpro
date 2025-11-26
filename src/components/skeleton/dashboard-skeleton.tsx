const DashboardSkeleton = () => {
  return (
    <div className="px-4 py-6 space-y-4 animate-pulse">
      {/* Title */}
      {/* <div className="w-40 h-6 bg-gray-300 rounded" /> */}

      {/* Chart Placeholder */}
      <div className="h-[200px] bg-gray-200 rounded-xl w-full" />

      {/* Meter Section */}
      <div className="grid grid-cols-12 gap-4">
        <div className="h-24 col-span-7 bg-gray-200 rounded-xl"></div>
        <div className="h-24 col-span-5 bg-gray-200 rounded-xl"></div>
      </div>

      {/* Input Selanjutnya */}
      <div className="flex items-center justify-between p-4 text-white bg-blue-400 rounded-xl">
        <div className="space-y-1">
          <div className="w-32 h-4 bg-blue-300 rounded" />
          <div className="w-40 h-4 bg-blue-300 rounded" />
        </div>
        <div className="w-20 h-6 bg-blue-300 rounded" />
      </div>
      <div className="flex items-center justify-center mt-4">
        <div className="w-full p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-32 h-6 bg-gray-300 rounded" />
          </div>

          <div className="mb-4 border-b border-gray-300" />

          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="h-10 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
