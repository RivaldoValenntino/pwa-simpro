export const FormPompaSkeleton = () => {
  return (
    <div className="w-full mx-auto bg-white rounded-xl shadow p-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between bg-gray-300 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse" />
          <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
        </div>
        <div className="text-right">
          <div className="h-6 w-12 bg-gray-300 rounded-md animate-pulse mb-1" />
          <div className="h-4 w-10 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>

      {/* Body Skeleton */}
      <div className="text-center mb-4">
        <div className="h-4 w-24 bg-gray-300 rounded mx-auto animate-pulse mb-2" />
        <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
      </div>
      {/* Kotak Foto */}
      {/* <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center mb-4"></div>
      <div className="my-4">
        <div className="h-4 w-10 bg-gray-300 rounded mb-1 animate-pulse" />
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
      </div> */}
      {/* Proses Button */}
      <div className="h-10 w-full bg-blue-200 rounded-lg animate-pulse mb-4" />

      {/* Pompa Toggles */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between mb-2 w-full">
          <div className="flex items-center justify-center mx-auto gap-8">
            <div className="w-20 h-5 bg-gray-300 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}

      {/* Hz Input */}
      <div className="mt-4">
        <div className="h-4 w-10 bg-gray-300 rounded mb-1 animate-pulse" />
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};
