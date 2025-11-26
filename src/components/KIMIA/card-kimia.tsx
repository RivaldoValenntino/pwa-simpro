import React from "react";

type CardKimiaProps = {
  namaWTP: string;
  isPast: boolean;
  onLihatDetail?: (id: number, type: string) => void;
  data: {
    id: string;
    label: string;
    type: string;
    isFilled: boolean;
  }[];
  onCatat: (id: string, type: string) => void;
};

const CardKimia: React.FC<CardKimiaProps> = ({
  namaWTP,
  data,
  onCatat,
  isPast,
  onLihatDetail,
}) => {
  return (
    <div className="rounded-xl p-4 shadow-md bg-white w-full space-y-4">
      <h3 className="text-center font-semibold mb-3">{namaWTP}</h3>
      <div className="flex flex-col">
        {data.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between py-2   ${
              idx < data.length - 1 ? "border-b border-gray-300" : ""
            }`}
          >
            <span>{item.label}</span>
            <button
              onClick={() =>
                isPast
                  ? onLihatDetail && onLihatDetail(Number(item.id), item.type)
                  : onCatat(item.id, item.type)
              }
              className={`rounded-md py-1 text-sm font-semibold ${
                item.isFilled || isPast
                  ? "bg-primary text-white px-5"
                  : "bg-greenCust/70 text-[#222222]/80 px-3"
              }`}
            >
              {isPast ? "Lihat" : item.isFilled ? "Edit" : "Catat"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardKimia;
