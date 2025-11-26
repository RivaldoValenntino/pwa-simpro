import { ClockIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import NoImage from "../../assets/images/no-image-removebg-preview.png";
interface PompAmpCardProps {
  title: string;
  onAction?: () => void;
  titleAction?: string;
  bgColor?: string;
  btnColor?: string;
  AktifTerbaca?: number;
  TidakAktif?: number;
  jumlahPompa?: number;
  images?: string;
  isDone: number;
  waktuCatat?: string | null;
  isPast: boolean;
}

const PompAmpCard: React.FC<PompAmpCardProps> = ({
  title,
  AktifTerbaca,
  TidakAktif,
  onAction,
  titleAction,
  images = [],
  bgColor = "bg-white",
  btnColor,
  jumlahPompa,
  waktuCatat,
  isDone,
  isPast,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const files = JSON.parse(images as string);
  return (
    <div className={`p-4 mb-4  shadow-none rounded-xl ${bgColor}`}>
      <div className="flex justify-between gap-1">
        <p className="mb-2 text-xs font-semibold text-center">{title}</p>
        <div
          className={`mb-2 text-xs font-normal text-center flex gap-1 items-center justify-center ${waktuCatat !== null ? "bg-blueCust px-2 py-1 rounded-md" : "hidden"}`}
        >
          <span className="text-center text-xs">Waktu :</span>
          <ClockIcon className="inline w-4 h-4" />
          <span className="text-xs text-center">{waktuCatat}</span>
        </div>
      </div>
      <div className="flex h-full gap-4">
        {/* Konten kanan */}
        <div className="flex flex-col justify-between flex-1 text-xs ">
          <div>
            <div className="my-1 border-b border-gray-300" />
            <p className="flex justify-between py-1 ">
              <span>Jumlah Pompa</span>
              <span className="font-bold text-md">{jumlahPompa}</span>
            </p>
            <div className="my-1 border-b border-gray-300" />
            <p className="flex justify-between py-1 ">
              <span>Aktif Terbaca</span>
              <span className="font-bold text-md">{AktifTerbaca}</span>
            </p>
            <div className="my-1 border-b border-gray-300" />
            <p className="flex justify-between py-1 ">
              <span>Tidak Aktif</span>
              <span className="font-bold text-md">{TidakAktif}</span>
            </p>
          </div>

          {isDone !== 0 && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className={`w-full px-4 py-2 mt-2 font-semibold text-white rounded-md bg-blueCust hover:bg-blueCust/80`}
            >
              Lihat Foto
            </button>
          )}
          <button
            type="button"
            onClick={onAction}
            className={`w-full px-4 py-2 mt-2 font-semibold text-white transition rounded-md ${isPast ? "hidden" : "block"} ${btnColor}`}
          >
            {titleAction}
          </button>

          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg p-6 w-full max-w-xs relative max-h-[70dvh] overflow-y-auto">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                >
                  <XCircleIcon className="w-8 h-8" />
                </button>

                <h2 className="text-lg font-semibold mb-4 text-black">
                  Detail Pompa
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {files.map(
                    (
                      img: { filename: string; urut_ke: number },
                      idx: number
                    ) => (
                      <div key={idx} className="flex flex-col items-center">
                        <img
                          src={img.filename || NoImage}
                          alt={`Pompa ${img.urut_ke}`}
                          className="w-full h-72 object-cover rounded-lg"
                        />
                        <span className="mt-2 text-sm text-black">
                          Foto Pompa {img.urut_ke}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PompAmpCard;
