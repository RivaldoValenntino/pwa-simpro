const ListCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-xl p-4 mb-4 shadow-sm">
      {/* Gambar dan Info */}
      <div className="flex gap-4">
        {/* Gambar Placeholder */}
        <div className="w-20 h-20 bg-gray-300 rounded-md"></div>

        {/* Info */}
        <div className="flex flex-col justify-between flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/3" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="h-4 bg-gray-300 rounded w-2/3" />
          <div className="mt-4 h-8 w-full bg-gray-300 rounded-md mx-auto" />
        </div>
      </div>

      {/* Tombol */}
    </div>
  );
};

export default ListCardSkeleton;
