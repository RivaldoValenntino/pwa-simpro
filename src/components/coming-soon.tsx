import { ClockIcon } from "@heroicons/react/24/outline";

const ComingSoon = () => {
  return (
    <div className="flex items-center justify-center px-4 rounded-xl bg-whiteCust">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <ClockIcon className="w-20 h-20 mb-4 text-gray-400" />
        <h1 className="mb-2 text-3xl font-semibold text-gray-800">
          Coming Soon
        </h1>
        <p className="text-base text-gray-500">
          Halaman ini masih dalam pengembangan. Silakan kembali lagi nanti.
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
