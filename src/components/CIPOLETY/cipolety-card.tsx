import React, { useState } from "react";
import NotFound from "../../assets/images/no-image.jpg";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type CipoletyCardProps = {
  nama_wtp: string;
  cipolety1_tinggi: string | null;
  cipolety1_ld: string | null;
  cipolety2_tinggi: string | null;
  cipolety2_ld: string | null;
  cipolety1_img: string | null;
  cipolety2_img: string | null;
  btnClassName?: string;
  btnTitle?: string;
  btnAction: () => void;
  btnColor?: string;
  bgColor?: string;
  isPast?: boolean;
};

export const CipoletyCard: React.FC<CipoletyCardProps> = ({
  nama_wtp,
  cipolety1_tinggi,
  cipolety1_ld,
  cipolety2_tinggi,
  cipolety2_ld,
  cipolety1_img,
  cipolety2_img,
  btnClassName,
  btnTitle,
  btnAction,
  bgColor,
  isPast,
}) => {
  // state untuk lightbox
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // siapkan slides untuk lightbox
  const slides = [
    { src: cipolety1_img && cipolety1_img !== "" ? cipolety1_img : NotFound },
    { src: cipolety2_img && cipolety2_img !== "" ? cipolety2_img : NotFound },
  ];

  return (
    <div className={`${bgColor} rounded-xl shadow-md p-4 mb-6`}>
      <h2 className="mb-4 text-lg font-bold text-center">{nama_wtp}</h2>

      <div className="gap-6 cipolety-container">
        {/* CIP 1 */}
        <div className="flex-1">
          <p className="mb-2 font-semibold text-center">Cipolety 1</p>
          <div className="flex items-center gap-3">
            {/* Gambar */}
            <div
              className="flex flex-col items-center justify-center w-24 h-24 overflow-hidden cursor-pointer"
              onClick={() => {
                setPhotoIndex(0);
                setOpen(true);
              }}
            >
              <img
                src={
                  cipolety1_img === null || cipolety1_img === ""
                    ? NotFound
                    : cipolety1_img
                }
                alt="Cipolety 1"
                className="object-cover w-full h-full rounded-lg"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="inline-block bg-[#F9A273] text-gray-800 text-sm px-3 py-1 rounded-full w-fit">
                  Tinggi
                </span>
                <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full w-fit">
                  {cipolety1_tinggi ?? "-"}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="inline-block bg-[#CAE2F9] text-gray-800 text-sm px-3 py-1 rounded-full w-fit">
                  Liter/Detik
                </span>
                <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full w-fit">
                  {cipolety1_ld ?? "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="w-px bg-gray-300 cipolety-separator"></div>

        {/* CIP 2 */}
        <div className="flex-1">
          <p className="mb-2 font-semibold text-center">Cipolety 2</p>
          <div className="flex items-center gap-3">
            {/* Gambar */}
            <div
              className="flex flex-col items-center justify-center w-24 h-24 overflow-hidden cursor-pointer"
              onClick={() => {
                setPhotoIndex(1);
                setOpen(true);
              }}
            >
              <img
                src={
                  cipolety2_img === null || cipolety2_img === ""
                    ? NotFound
                    : cipolety2_img
                }
                alt="Cipolety 2"
                className="object-cover w-full h-full rounded-lg"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="inline-block bg-[#F9A273] text-gray-800 text-sm px-3 py-1 rounded-full w-fit">
                  Tinggi
                </span>
                <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full w-fit">
                  {cipolety2_tinggi ?? "-"}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="inline-block bg-[#CAE2F9] text-gray-800 text-sm px-3 py-1 rounded-full w-fit">
                  Liter/Detik
                </span>
                <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full w-fit">
                  {cipolety2_ld ?? "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Catat */}
      <div className="mt-6">
        <button
          onClick={btnAction}
          className={`w-full text-sm text-center py-2 font-bold rounded-md ${btnClassName} ${
            isPast ? "hidden" : "block"
          }`}
        >
          {btnTitle ?? "Catat"}
        </button>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={photoIndex}
      />
    </div>
  );
};
