import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ClockIcon } from "@heroicons/react/24/outline";

interface PompAtmCardProps {
  title: string;
  onAction?: () => void;
  titleAction?: string;
  image?: string;
  bgColor?: string;
  btnColor?: string;
  nilaiAtmSebelumnya?: number;
  nilaiAtmSekarang?: number;
  waktuCatat?: string | null;
  isPast: boolean;
}

const PompAtmCard: React.FC<PompAtmCardProps> = ({
  title,
  nilaiAtmSebelumnya,
  nilaiAtmSekarang,
  onAction,
  titleAction,
  image,
  bgColor = "bg-white",
  btnColor,
  waktuCatat,
  isPast,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={`p-4 mb-4 shadow-none rounded-xl ${bgColor}`}>
        <div className="flex justify-between items-center">
          <p className="mb-2 text-xs font-semibold text-center">{title}</p>
          <div
            className={`mb-2 text-xs font-normal text-center flex gap-1 items-center justify-center ${
              waktuCatat !== null
                ? "bg-blueCust px-2 py-1 rounded-md"
                : "hidden"
            }`}
          >
            <span className="text-center text-xs">Catat :</span>
            <ClockIcon className="inline w-4 h-4" />
            <span className="text-xs text-center">{waktuCatat}</span>
          </div>
        </div>
        <div className="flex h-full gap-4">
          {/* Gambar wrapper */}
          <div
            className="w-24 aspect-[4/3] h-auto flex-shrink-0 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <div className="w-full h-full overflow-hidden rounded-md">
              <img
                src={image}
                alt={title}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Konten kanan */}
          <div className="flex flex-col justify-between flex-1 text-xs ">
            <div>
              <div className="my-1 border-b border-gray-300" />
              <p className="flex justify-between py-1 ">
                <span>Nilai Sebelumnya:</span>
                <span>
                  {nilaiAtmSebelumnya === 0 ? "-" : nilaiAtmSebelumnya} bar
                </span>
              </p>
              <div className="my-1 border-b border-gray-300" />
              <p className="flex justify-between py-1 ">
                <span>Nilai Sekarang:</span>
                <span>
                  {nilaiAtmSekarang === 0 ? "-" : nilaiAtmSekarang} bar
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={onAction}
              className={`w-full px-4 py-2 mt-2 font-semibold text-white transition rounded-md ${
                isPast ? "hidden" : "block"
              }  ${btnColor}`}
            >
              {titleAction}
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={image ? [{ src: image }] : []}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
      />
    </>
  );
};

export default PompAtmCard;
