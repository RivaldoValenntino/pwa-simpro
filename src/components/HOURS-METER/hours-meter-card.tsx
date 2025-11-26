// import { ClockIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import NoImage from "../../assets/images/no-image.jpg";

type HoursMeterCardProps = {
  tanggalCatat: string | null;
  waktuCatat: string | null;
  namaPompa: string;
  urutKe: string;
  nilai: number;
  onAction?: () => void;
  image: string | null;
};

export default function HoursMeterCard({
  waktuCatat,
  namaPompa,
  urutKe,
  nilai,
  onAction,
  image,
}: HoursMeterCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-2 py-4 mb-4 shadow-none rounded-xl bg-primary text-white">
      <div className="flex justify-between">
        <p className="mb-2 text-[10px] font-semibold text-center capitalize">
          {namaPompa} - (Pompa {urutKe ?? "-"})
        </p>
        <div
          className={`mb-2 text-[10px] font-normal text-center flex gap-1 items-center justify-center ${
            waktuCatat !== null ? "bg-blueCust px-2 py-1 rounded-md" : "hidden"
          }`}
        >
          <span className="text-center">Waktu :</span>
          {/* <ClockIcon className="inline w-4 h-4" /> */}
          <span className="text-xs text-center">{waktuCatat}</span>
        </div>
      </div>

      <div className="flex h-full gap-4">
        {/* Gambar wrapper */}
        <div
          className="w-28 aspect-[4/3] h-auto flex-shrink-0 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="w-full h-full overflow-hidden rounded-md">
            <img
              src={image || NoImage}
              alt={namaPompa}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Konten kanan */}
        <div className="flex flex-col justify-between flex-1 text-xs">
          <div>
            <p className="flex justify-between py-1">
              <span>Nilai :</span>
              <span>{nilai === 0 ? "-" : nilai} jam</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onAction}
            className="w-full px-4 py-2 mt-2 font-semibold text-white transition rounded-md bg-greenCust hover:bg-greenCust/80"
          >
            Kirim Via Wa
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: image || NoImage }]}
      />
    </div>
  );
}
