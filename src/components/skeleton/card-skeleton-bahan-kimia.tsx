export default function CardPenggunaanBahanKimiaSkeleton() {
  return (
    <div className="bg-primary text-white p-4 rounded-xl w-full mx-auto space-y-2 animate-pulse">
      <div className="flex justify-between items-center mb-2">
        <div className="h-4 w-1/2 bg-blue-300 rounded" />
        {/* <div className="bg-blue-700 px-2 py-1 rounded text-sm w-1/3 h-4" /> */}
      </div>

      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex justify-between border-b border-blue-400 py-1 text-sm"
        >
          <div className="w-1/2 h-4 bg-blue-300 rounded mt-2" />
          <div className="w-1/4 h-4 bg-blue-300 rounded mt-2" />
        </div>
      ))}

      <div className="w-full mt-2 bg-greenCust py-2 rounded h-10" />
    </div>
  );
}
