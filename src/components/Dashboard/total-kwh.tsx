// components/TotalKwhCard.tsx

import type { FC } from "react";
import ICKwh from "../../assets/ic_kwh.svg";

interface TotalKwhCardProps {
  value?: number;
  jenis?: string;
}

const TotalKwhCard: FC<TotalKwhCardProps> = ({ value, jenis }) => {
  const jenisSatuanMap: Record<string, string> = {
    LWBP: "kWh",
    WBP: "kWh",
    KVRH: "kVArh",
  };

  const displaySatuan = jenis ? jenisSatuanMap[jenis] || "" : "";
  return (
    <div className="bg-cream rounded-xl px-4 pb-8 pt-4 w-full sm:w-auto flex flex-col items-center shadow-md">
      <div className="flex items-center justify-between w-full">
        <div className="text-left">
          <p className="text-xl text-black font-medium">Total</p>
          <p className="text-xl text-black font-medium">{displaySatuan}</p>
        </div>
        <div className="text-orange-500">
          <img src={ICKwh} alt="Kwh Icon" className="w-12 h-12" />
        </div>
      </div>
      <div className="border-t border-black/10 my-2 w-full"></div>
      <p className="text-3xl font-bold text-gray-900 mt-4">
        {value?.toLocaleString()}{" "}
        <span className="text-lg font-medium">{displaySatuan}</span>
      </p>
    </div>
  );
};

export default TotalKwhCard;
