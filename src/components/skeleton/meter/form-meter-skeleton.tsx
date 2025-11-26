const FormMeterSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-xl p-4 shadow-sm space-y-4">
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
      <div className="flex justify-between items-center px-2 mb-4 bg-gray-400 animate-pulse rounded-md h-12"></div>

      {/* Kotak Foto */}
      <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center"></div>

      {/* Input Stand Awal */}
      <div className="space-y-1">
        <div className="h-4 w-24 bg-gray-300 rounded" />
        <div className="h-10 w-full bg-gray-200 rounded-md" />
      </div>

      {/* Input Stand Akhir */}
      <div className="space-y-1">
        <div className="h-4 w-24 bg-gray-300 rounded" />
        <div className="h-10 w-full bg-gray-200 rounded-md" />
      </div>

      {/* Tombol Simpan */}
      <div className="h-10 w-full bg-gray-300 rounded-md" />
    </div>
  );
};

export default FormMeterSkeleton;
