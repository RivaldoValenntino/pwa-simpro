import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ClockIcon } from "@heroicons/react/20/solid";
import NoImage from "../../assets/images/no-image.jpg";

type DetailPemakaianKantorCardProps = {
  waktuCatat: string | null;
  namaMeter: string;
  standAwal: number;
  standAkhir: number;
  onAction?: () => void;
  pemakaian?: number;
  image: string | null;
};

export default function DetailPemakaianKantorCard({
  waktuCatat,
  namaMeter,
  standAwal,
  standAkhir,
  onAction,
  pemakaian,
  image,
}: DetailPemakaianKantorCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={`p-4 mb-4 shadow-none rounded-xl bg-primary text-white`}>
        <div className="flex justify-between">
          <p className="mb-2 text-sm font-semibold text-center capitalize">
            {namaMeter}
          </p>
          <div
            className={`mb-2 text-xs font-normal text-center flex gap-1 items-center justify-center ${
              waktuCatat !== null
                ? "bg-blueCust px-2 py-1 rounded-md"
                : "hidden"
            }`}
          >
            <span className="text-center">Waktu Catat :</span>
            <ClockIcon className="inline w-4 h-4" />
            <span className="text-sm text-center">{waktuCatat}</span>
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
                alt={namaMeter}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Konten kanan */}
          <div className="flex flex-col justify-between flex-1 text-xs ">
            <div>
              <p className="flex justify-between py-1 ">
                <span>Stand Meter Awal:</span>
                <span className="font-semibold">
                  {standAwal === 0 ? "–" : standAwal}
                </span>
              </p>
              <div className="my-1 border-b border-gray-300" />
              <p className="flex justify-between py-1 ">
                <span>Stand Meter Akhir:</span>
                <span>{standAkhir === 0 ? "-" : standAkhir}</span>
              </p>
              <div className="my-1 border-b border-gray-300" />
              <p className="flex justify-between py-1 ">
                <span>Pemakaian:</span>
                <span>{pemakaian === 0 ? "-" : pemakaian}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={onAction}
              className={`w-full px-4 py-2 mt-2 font-semibold text-white transition rounded-md bg-greenCust hover:bg-greenCust/80`}
            >
              Edit Pemakaian Kantor
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: image || NoImage }]}
      />
    </>
  );
}
