import React from "react";

type CuciCardProps = {
  title?: string;
  daftarBakSedimen?: string;
  daftarBakFiltrasi?: string;
  daftarBakFlokulator?: string;
  jumlahSedimen?: string | null;
  jumlahFiltrasi?: string | null;
  jumlahFlokulator?: string | null;
  sebelumnyaSedimen?: number | null;
  sebelumnyaFiltrasi?: number | null;
  sebelumnyaFlokulator?: number | null;
  waktuCatatTerakhir: string | null;
  isSedimenExist?: string;
  isFiltrasiExist?: string;
  isFlokulatorExist?: string;
  titleButton?: string;
  onAction?: () => void;
  onShowDetail?: (jenis: "sedimen" | "filtrasi" | "flokulator") => void;
  isPast: boolean;
};

const formatValue = (value: number | null | undefined) => {
  return value === null || value === undefined ? "-" : value;
};

export const CuciCardComponent: React.FC<CuciCardProps> = ({
  title = "-",
  daftarBakSedimen,
  daftarBakFiltrasi,
  daftarBakFlokulator,
  jumlahSedimen,
  jumlahFiltrasi,
  jumlahFlokulator,
  sebelumnyaSedimen,
  sebelumnyaFiltrasi,
  sebelumnyaFlokulator,
  waktuCatatTerakhir,
  isSedimenExist,
  isFiltrasiExist,
  isFlokulatorExist,
  titleButton,
  onAction,
  onShowDetail,
  isPast,
}) => {
  return (
    <div className="w-full p-4 mx-auto my-4 bg-white shadow-md sm:p-6 rounded-xl">
      {/* Title */}
      <h2 className="mb-4 text-base font-bold text-center break-words sm:text-lg">
        {title}
      </h2>

      {/* Main 3 Card Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6 text-center">
        {/* Sedimen */}

        <div
          className={`p-3 overflow-hidden rounded-lg sm:p-4 ${isSedimenExist === "1" ? "bg-primary text-white" : "bg-gray-100"}`}
        >
          <p className="text-xs font-semibold break-words sm:text-sm">
            Sedimen
          </p>
          <p
            className={`text-[10px] sm:text-xs ${isSedimenExist === "1" ? "text-white" : "text-gray-500"}`}
          >
            Jumlah Cuci
          </p>
          <p className="mt-1 text-2xl font-bold sm:text-3xl">
            {jumlahSedimen ?? "-"}
          </p>
          {isSedimenExist === "1" && (
            <p
              className="mt-1 text-[12px] sm:text-xs cursor-pointer underline"
              onClick={() => onShowDetail?.("sedimen")}
            >
              Detail
            </p>
          )}
        </div>
        {/* Filtrasi */}
        <div
          className={`p-3 overflow-hidden rounded-lg sm:p-4 ${
            isFiltrasiExist === "1" ? "bg-primary text-white" : "bg-gray-100"
          }`}
        >
          <p className="text-xs font-semibold break-words sm:text-sm">
            Filtrasi
          </p>
          <p
            className={`text-[10px] sm:text-xs ${
              isFiltrasiExist === "1" ? "text-white" : "text-gray-500"
            }`}
          >
            Jumlah Cuci
          </p>
          <p className="mt-1 text-2xl font-bold sm:text-3xl">
            {jumlahFiltrasi ?? "-"}
          </p>
          {isFiltrasiExist === "1" && (
            <p
              className="mt-1 text-[12px] sm:text-xs cursor-pointer underline"
              onClick={() => onShowDetail?.("filtrasi")}
            >
              Detail
            </p>
          )}
        </div>

        {/* Flokulator */}
        <div
          className={`p-3 overflow-hidden rounded-lg sm:p-4 ${
            isFlokulatorExist === "1" ? "bg-primary text-white" : "bg-gray-100"
          }`}
        >
          <p className="text-xs font-semibold break-words sm:text-sm">
            Flokulator
          </p>
          <p
            className={`text-[10px] sm:text-xs ${
              isFlokulatorExist === "1" ? "text-white" : "text-gray-500"
            }`}
          >
            Jumlah Cuci
          </p>
          <p className="mt-1 text-2xl font-bold sm:text-3xl">
            {jumlahFlokulator ?? "-"}
          </p>
          {isFlokulatorExist === "1" && (
            <p
              className="mt-1 text-[12px] sm:text-xs cursor-pointer underline"
              onClick={() => onShowDetail?.("flokulator")}
            >
              Detail
            </p>
          )}
        </div>
      </div>

      <p className="py-2 text-xs font-bold">
        Waktu Catat Terakhir : {waktuCatatTerakhir}
      </p>
      {/* Previous Count Info */}
      <div className="mb-6 space-y-1 text-[10px] text-gray-700 break-words sm:text-sm">
        <p>
          Jumlah Pencucian <strong>SEDIMEN</strong> sebelumnya:{" "}
          <span className="font-semibold">
            {formatValue(sebelumnyaSedimen)} ({daftarBakSedimen || "-"})
          </span>
        </p>
        <p>
          Jumlah Pencucian <strong>FILTRASI</strong> sebelumnya:{" "}
          <span className="font-semibold">
            {formatValue(sebelumnyaFiltrasi)} ({daftarBakFiltrasi || "-"})
          </span>
        </p>
        <p>
          Jumlah Pencucian <strong>FLOKULATOR</strong> sebelumnya:{" "}
          <span className="font-semibold">
            {formatValue(sebelumnyaFlokulator)} ({daftarBakFlokulator || "-"})
          </span>
        </p>
      </div>

      {/* Button */}
      <button
        onClick={onAction}
        className={`w-full py-2 font-semibold text-white rounded-md bg-greenCust hover:bg-greenCust disabled:opacity-50 ${isPast ? "hidden" : "block"}`}
      >
        {titleButton}
      </button>
    </div>
  );
};
