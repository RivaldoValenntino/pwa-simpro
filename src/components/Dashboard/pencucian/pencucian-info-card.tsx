import React from "react";

interface PencucianRow {
  jenis: string;
  cuci: number;
  jumlah: number;
  bak: string;
}

interface PencucianInfoCardProps {
  wtpName: string;
  updateDt: string;
  data: PencucianRow[];
}

const PencucianInfoCard: React.FC<PencucianInfoCardProps> = ({
  wtpName,
  data,
  updateDt,
}) => {
  const jenisColors: Record<PencucianRow["jenis"], string> = {
    sedimen: "bg-blue-500",
    filtrasi: "bg-orange-500",
    flokulator: "bg-cyan-400",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center text-center">
        <h2 className="text-lg font-bold">{wtpName}</h2>
        {/* <div className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
          <span>Hasil Catat :</span>
          <span className="font-semibold flex items-center gap-1">
          <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          >
          <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6l4 2"
              />
            </svg>
            {hasilCatat ? hasilCatat : "Tidak ada catatan"}
          </span>
        </div> */}
      </div>
      <div className="flex flex-col gap-1 py-3">
        <p className="text-sm text-gray-800 font-semibold">Terakhir Catat</p>
        <p className="text-sm text-gray-800 font-semibold">{updateDt}</p>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-3 bg-gray-100 rounded-t-xl overflow-hidden">
        <div className="col-span-1"></div>
        <div className="col-span-1 text-center bg-primary text-white py-1 font-semibold text-sm">
          CUCI
        </div>
        <div className="col-span-1 text-center bg-[#1040E1] text-white py-1 font-semibold text-sm">
          JUMLAH
        </div>
      </div>

      {/* Table Rows */}
      {data.map((row, idx) => (
        <div
          key={idx}
          className="grid grid-cols-3 items-center border-b last:border-none py-2"
        >
          {/* Label */}
          <div className="flex items-center gap-1">
            <div
              className={`flex-shrink-0 w-2 h-2 rounded-full ${jenisColors[row.jenis]}`}
            />
            <div className="text-xs leading-tight">
              {/* <p>Jumlah Pencucian </p> */}
              <p className="font-bold uppercase">{row.jenis}</p>
            </div>
          </div>

          {/* Cuci */}
          <p className="text-center font-semibold text-xs">
            {row.cuci} {`(${row.bak})`}
          </p>
          {/* Jumlah */}
          <p className="text-center font-semibold text-xs">{row.jumlah}</p>
        </div>
      ))}
    </div>
  );
};

export default PencucianInfoCard;
