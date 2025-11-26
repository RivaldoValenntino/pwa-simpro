import React from "react";

export interface KwluaCardProps {
  nama_wtp: string;
  air_baku_ntu: number | null;
  air_baku_ph: number | null;
  air_sediment_ntu: number | null;
  air_sediment_ph: number | null;
  air_produksi_ntu: number | null;
  air_produksi_ph: number | null;
  onCatat?: (type: string) => void;
  isPast?: boolean;
  onLihatDetail?: (type: string) => void;
}

const KwluaCard: React.FC<KwluaCardProps> = ({
  nama_wtp,
  air_baku_ntu,
  air_baku_ph,
  air_sediment_ntu,
  air_sediment_ph,
  air_produksi_ntu,
  air_produksi_ph,
  onCatat,
  isPast,
  onLihatDetail,
}) => {
  const data = [
    {
      label: "Air Baku",
      type: "air_baku",
      ntu: air_baku_ntu,
      ph: air_baku_ph,
    },
    {
      label: "Air Sediment",
      type: "air_sediment",
      ntu: air_sediment_ntu,
      ph: air_sediment_ph,
    },
    {
      label: "Air Produksi",
      type: "air_produksi",
      ntu: air_produksi_ntu,
      ph: air_produksi_ph,
    },
  ];

  return (
    <div className="w-full p-4 mx-auto mb-4 bg-white shadow-md rounded-xl">
      <h2 className="mb-2 text-sm font-bold text-center text-gray-800 uppercase">
        {nama_wtp}
      </h2>

      <div className="grid grid-cols-4 gap-2 mb-2 text-xs font-medium text-center text-gray-700">
        <div></div>
        <div className="bg-[#CEDAFF] text-[#222222] rounded py-1">NTU</div>
        <div className="bg-[#CEDAFF] text-[#222222] rounded py-1">PH</div>
        <div></div>
      </div>

      <div className="space-y-4 text-sm">
        {data.map((item, index) => (
          <div
            key={index}
            className="grid items-center grid-cols-4 gap-2 text-gray-700"
          >
            <p className="text-xs text-nowrap">{item.label}</p>
            <div className="text-center text-gray-500">
              {item.ntu !== null ? item.ntu : "–"}
            </div>
            <div className="text-center text-gray-500">
              {item.ph !== null ? item.ph : "–"}
            </div>
            <div className="text-right">
              {isPast ? (
                <button
                  className="px-3 py-2 text-xs font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  onClick={() => onLihatDetail?.(item.type)}
                >
                  Lihat
                </button>
              ) : (
                <button
                  className={` text-xs py-2 rounded-md font-semibold  ${
                    item.ntu !== null || item.ph !== null
                      ? "px-[18px] bg-primary hover:bg-primary/80 text-white"
                      : "px-3 bg-greenCust hover:bg-greenCust/90 text-[#4C4A4A]"
                  }`}
                  onClick={() => onCatat?.(item.type)}
                >
                  {item.ntu !== null || item.ph !== null ? "Edit" : "Catat"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KwluaCard;
