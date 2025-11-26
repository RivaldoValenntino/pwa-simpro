/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import type { AnomaliData } from "../../types/responses/trans-anomali/list-anomali";
import { formatTanggalIndo } from "../../utils/date-helper";
import { CameraIcon, EllipsisVertical } from "lucide-react";
import {
  UpdateAnomaliSchema,
  type UpdateAnomaliRequest,
} from "../../types/requests/trans-anomali/update-anomali";
import { useAuthStore } from "../../store/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFileQuery } from "../../queries/upload-file/upload-file";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import { updateTransAnomali } from "../../queries/anomali/update-anomali";
import { useMutation } from "@tanstack/react-query";
import CameraWithZoom from "../camera-with-zoom";
import imageCompression from "browser-image-compression";
import FullScreenSpinner from "../full-screen-spinner";
import { XCircleIcon } from "@heroicons/react/20/solid";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface Props {
  data: AnomaliData[] | [];
  isLoading?: boolean;
  isFetching?: boolean;
}

const getResikoColor = (resiko: string | null): string => {
  switch (resiko?.toLowerCase()) {
    case "kecil":
      return "bg-green-500";
    case "sedang":
      return "bg-yellow-500";
    case "tinggi":
      return "bg-red-700";
    default:
      return "bg-gray-300";
  }
};

const AnomaliTable: React.FC<Props> = ({ data, isLoading, isFetching }) => {
  const [selectedData, setSelectedData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showModalFormRealisasi, setShowModalFormRealisasi] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loadingUploadedFile, setLoadingUploadedFile] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cachedFormData, setCachedFormData] =
    useState<UpdateAnomaliRequest | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    setShowModalFormRealisasi(false); // tutup modal dulu
    setShowCamera(true); // buka kamera
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<UpdateAnomaliRequest>({
    resolver: zodResolver(UpdateAnomaliSchema),
    defaultValues: {
      id_petugas: Number(useAuthStore.getState().user?.id),
    },
  });
  const onSubmit = async (data: UpdateAnomaliRequest) => {
    console.log(data);
    if (photoFile) {
      try {
        setLoadingUploadedFile(true);
        const secretKey = import.meta.env.VITE_API_SECRET_KEY;

        // Upload file ke API
        const uploadResult = await uploadFileQuery(
          photoFile,
          `foto_anomali-${Date.now()}`,
          "simpro/trans/foto_realisasi",
          secretKey
        );

        // Set URL ke form data
        data.foto = uploadResult.url;

        setCachedFormData(data);
        setShowConfirmModal(true);
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Gagal mengunggah foto : " + err);
      } finally {
        setLoadingUploadedFile(false);
      }
    } else {
      setCachedFormData(data);
      setShowConfirmModal(true);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateTransAnomali,
  });
  return (
    <div className="max-w-full mx-auto overflow-hidden bg-white rounded-md shadow-md">
      {loadingUploadedFile && <FullScreenSpinner />}
      <div className="flex items-center gap-2 p-3">
        <span className="w-12 h-2 bg-primary"></span>
        <p className="text-xs font-semibold">Sudah Realisasi</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs font-semibold text-gray-500 bg-gray-100">
              <th className="px-4 py-3 text-center">Resiko</th>
              <th className="px-4 py-3 text-center">Jenis</th>
              <th className="px-4 py-3 text-center">Tanggal</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={4} className="p-4">
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-4 rounded-full border-primary border-t-transparent animate-spin" />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 italic text-center text-gray-400"
                >
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className={`
                  ${Number(item.is_closed) === 1 ? "bg-primary text-white" : "bg-white text-gray-800"} 
                  transition-colors
                `}
                >
                  {/* Kolom Resiko */}
                  <td className="px-4 py-3 border-none">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${getResikoColor(item.resiko)}`}
                      ></span>
                      <p className="text-xs font-semibold capitalize">
                        {item.resiko}
                      </p>
                    </div>
                  </td>

                  {/* Kolom Jenis */}
                  <td className="px-4 py-3 text-xs font-medium">
                    {item.nama_anomali}
                  </td>

                  {/* Kolom Tanggal */}
                  <td className="px-4 py-3 text-center text-[10px]">
                    {formatTanggalIndo(item.tgl)}
                  </td>

                  {/* Kolom Aksi */}
                  <td className="relative px-1 py-3 text-center">
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === index ? null : index
                          )
                        }
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        <EllipsisVertical className="w-6 h-6 text-gray-800" />
                      </button>
                    </div>

                    {/* Dropdown */}
                    {activeDropdown === index && (
                      <div
                        className="absolute z-10 w-40 bg-white border rounded-lg shadow-md right-10 top-10"
                        ref={dropdownRef}
                        style={{
                          top: index === data.length - 1 ? "-10px" : "5px",
                        }}
                      >
                        <ul className="text-sm text-gray-700 divide-y">
                          <li>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedData(item);
                                setShowModal(true);
                                setActiveDropdown(null);
                              }}
                              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                            >
                              Detail
                            </button>
                          </li>
                          {Number(item.is_closed) === 0 && (
                            <li>
                              <button
                                onClick={() => {
                                  setSelectedData(item);
                                  setShowModalFormRealisasi(true);
                                  setActiveDropdown(null);
                                }}
                                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                              >
                                Realisasi
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 w-dvw h-dvh">
          <div className="relative z-50 mx-auto bg-black rounded-lg ">
            <CameraWithZoom
              onCapture={async (file, dataUrl) => {
                setPhotoUrl(dataUrl);

                const options = {
                  maxSizeMB: 0.2,
                  maxWidthOrHeight: 1024,
                  useWebWorker: true,
                };
                const compressedFile = await imageCompression(file, options);
                setPhotoFile(compressedFile);

                toast.success("Foto berhasil diambil");
                setShowCamera(false);
                setShowModalFormRealisasi(true); // buka lagi modal
              }}
              onClose={() => {
                setShowCamera(false);
                setShowModalFormRealisasi(true);
              }}
            />
          </div>
        </div>
      )}
      {showModal && selectedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
            <h1 className="mb-4 text-lg font-bold">Detail Anomali</h1>

            <div className="space-y-2 max-w-md max-h-[50vh] overflow-y-auto pr-2">
              {/* Status Realisasi */}
              {"is_closed" in selectedData && (
                <div className="text-sm">
                  <span className="font-semibold capitalize">
                    Status Realisasi :
                  </span>{" "}
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full font-medium
                    ${
                      selectedData.is_closed === "1"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedData.is_closed === "1" ? "Sudah" : "Belum"}
                  </span>
                </div>
              )}

              {/* Data lainnya */}
              {Object.entries(selectedData)
                .filter(
                  ([key]) =>
                    key !== "id_petugas" &&
                    key !== "id_jenis_anomali" &&
                    key !== "id_installasi" &&
                    key !== "created_dt" &&
                    key !== "updated_dt" &&
                    key !== "created_user" &&
                    key !== "is_closed" &&
                    key !== "nama_anomali" &&
                    key !== "nama_installasi" &&
                    key !== "id"
                )
                .map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-semibold capitalize">
                      {key === "vfilename"
                        ? "File"
                        : key.includes("tgl")
                          ? "Tanggal"
                          : key.replace(/_/g, " ")}
                      :
                    </span>{" "}
                    <span className="block break-words">
                      {value == null ? (
                        "-"
                      ) : typeof value === "string" &&
                        value.startsWith("https") ? (
                        <div className="mt-1 text-center">
                          <img
                            src={value}
                            alt={key}
                            className="w-24 h-24 mx-auto transition border rounded-md cursor-pointer hover:opacity-80"
                            onClick={() => {
                              setLightboxImage(value);
                              setLightboxOpen(true);
                            }}
                          />
                          <p className="mt-1 text-[12px] text-gray-500 italic">
                            Klik gambar untuk lihat secara penuh
                          </p>
                        </div>
                      ) : typeof value === "string" ||
                        typeof value === "number" ? (
                        value
                      ) : (
                        JSON.stringify(value)
                      )}
                    </span>
                  </div>
                ))}
            </div>

            <button
              onClick={() => {
                setShowModal(false);
              }}
              className="w-full py-2 mt-4 font-semibold text-white rounded-md bg-primary"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      {showModalFormRealisasi && selectedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-xs p-6 bg-white rounded-xl shadow-xl max-h-[70dvh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold">Realisasi Anomali</h1>
              <button
                type="button"
                onClick={() => setShowModalFormRealisasi(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <XCircleIcon className="w-8 h-8" />
              </button>
            </div>

            {/* Short info */}
            <div className="space-y-2 text-sm">
              <p>
                Nama Anomali:{" "}
                <p className="font-semibold">{selectedData.nama_anomali}</p>
              </p>
              <p>
                Jenis Anomali:{" "}
                <p className="font-semibold">{selectedData.nama_anomali}</p>
              </p>
              <p>
                Dampak: <p className="font-semibold">{selectedData.dampak}</p>
              </p>
              <p>
                Keterangan{" "}
                <p className="font-semibold">{selectedData.keterangan}</p>
              </p>
              <p>
                Tanggal:{" "}
                <p className="font-semibold">
                  {formatTanggalIndo(selectedData.tgl)}
                </p>
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Status Realisasi */}

              {Object.keys(errors).length > 0 && (
                <ul className="mt-4 mb-6 space-y-2 text-sm text-red-600">
                  {Object.entries(errors).map(([key, value]) => (
                    <li key={key}>
                      {" "}
                      {key} - {value.message}
                    </li>
                  ))}
                </ul>
              )}

              <input
                type="hidden"
                {...register("id_anomali", { valueAsNumber: true })}
                value={selectedData.id}
              />

              {/* Feedback */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Feedback Realisasi
                </label>
                <textarea
                  className="w-full px-3 py-2 text-sm border rounded"
                  {...register("feedback")}
                  rows={3}
                  placeholder="Masukkan feedback realisasi..."
                ></textarea>
              </div>

              {/* Foto Realisasi */}
              <div>
                <button
                  type="button"
                  onClick={handleTakePhoto}
                  className="flex items-center justify-center w-full py-2 mt-4 space-x-2 text-sm font-medium text-center text-blue-600 bg-blue-100 rounded-t-lg"
                >
                  <CameraIcon className="w-5 h-5 mb-0.5" />
                  <span className="text-center">Foto Realisasi</span>
                </button>

                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Foto Anomali"
                    className="object-cover w-full h-48 rounded-b-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full text-sm text-gray-400 bg-gray-200 rounded-b-lg h-36">
                    Belum ada foto
                  </div>
                )}
              </div>

              {/* Tombol */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-2 text-white rounded-md bg-primary"
                >
                  {isPending ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-11/12 max-w-sm p-6 bg-white shadow-lg rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-center">
              Konfirmasi Simpan Data
            </h3>

            <div className="space-y-2 text-sm text-gray-700">
              <p className="text-center">
                Apakah Anda yakin ingin menyimpan data ini?
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg"
                onClick={() => setShowConfirmModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                onClick={() => {
                  if (!cachedFormData) return;
                  mutate(cachedFormData, {
                    onSuccess: () => {
                      setShowModalFormRealisasi(false);
                      reset();
                      setPhotoFile(null);
                      setPhotoUrl(null);
                      toast.success("Berhasil Realisasi Anomali");
                      // setTimeout(() => {

                      queryClient.invalidateQueries({
                        queryKey: [
                          "fetchLastActivity",
                          useAuthStore.getState().user?.id,
                        ],
                      });
                      window.location.reload();

                      // }, 2000);
                    },
                    onError: (error: unknown) => {
                      console.error("Gagal menyimpan data:", error);
                      toast.error("Terjadi kesalahan saat menyimpan data");
                    },
                  });
                  setShowConfirmModal(false);
                }}
              >
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxImage ? [{ src: lightboxImage }] : []}
      />
    </div>
  );
};

export default AnomaliTable;
