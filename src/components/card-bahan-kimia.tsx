import { formateDateTimeIndo } from "../utils/date-helper";
import { BeakerIcon } from "@heroicons/react/20/solid";

type Props = {
  data: {
    jenis_bahan_kimia?: string;
    nilai?: string;
    satuan?: string;
    nama_petugas?: string;
    waktu: string;
    keterangan?: string;
  }[];
};

export default function CardPenggunaanBahanKimia({ data }: Props) {
  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {data.map((item, i) => (
        <div
          key={i}
          className="p-4 transition bg-white border border-gray-100 shadow-md rounded-2xl hover:shadow-lg"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BeakerIcon className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-gray-800">
                {item.jenis_bahan_kimia || "Bahan Kimia"}
              </h3>
            </div>
            <p className="text-xs text-gray-500">
              {formateDateTimeIndo(item.waktu)}
            </p>
          </div>

          {/* Body */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Petugas:{" "}
                <span className="font-semibold text-primary">
                  {item.nama_petugas}
                </span>
              </p>
              {item.keterangan && (
                <p className="mt-1 text-xs text-gray-500">
                  “{item.keterangan}”
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-blue-600">
                {item.nilai} {item.satuan}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
