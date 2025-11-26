/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import {
  InsertDosisSchema,
  type InsertDosisRequest,
} from "../../../../types/requests/dosis/insert-dosis";
import { listReservoarQuery } from "../../../../queries/rsv/list-rsv";
import { useAuthStore } from "../../../../store/auth";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertDosisData } from "../../../../queries/dosis/insert-dosis";
import { uploadFileQuery } from "../../../../queries/upload-file/upload-file";
import toast from "react-hot-toast";
import FormMeterSkeleton from "../../../../components/skeleton/meter/form-meter-skeleton";
import TimeInfo from "../../../../components/time-info";
import Total from "../../../../components/ui/total";
import FullScreenSpinner from "../../../../components/full-screen-spinner";
import { CameraIcon } from "@heroicons/react/24/outline";
import { useServerTime } from "../../../../hooks/useServerTime";
import { queryClient } from "../../../../main";
import imageCompression from "browser-image-compression";
import z from "zod";
import BackButton from "../../../../components/back-button";
import { DetailReservoarQuery } from "../../../../queries/rsv/detail-rsv";
import CameraWithZoom from "../../../../components/camera-with-zoom";
import { DataDosisSebelumnyaQuery } from "../../../../queries/rsv/get-previous-data";
import { ChevronDown } from "lucide-react";
export const Route = createFileRoute("/__authenticated/form/dosis/$id")({
  component: RouteComponent,
  validateSearch: z.object({
    kode: z.string(),
    id_reservoar: z.number(),
    jam: z.number(),
    nama: z.string(),
  }),
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { jam, id_trans, nama, id_reservoar, kode } = useSearch({
    strict: false,
  });
  const id_petugas = useAuthStore.getState().user?.id;
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [showCamera, setShowCamera] = useState(false);

  const [loadingUploadedFile, setLoadingUploadedFile] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cachedFormData, setCachedFormData] =
    useState<InsertDosisRequest | null>(null);

  const navigate = useNavigate();
  const time = useServerTime();
  if (!jam) navigate({ to: "/not-found" });
  const {
    data: detailData,
    isLoading: isLoadingDetail,
    isFetching: isFetchingDetail,
  } = useQuery(
    DetailReservoarQuery(Number(id), kode, Number(id_reservoar), jam, id_trans)
  );
  // const ketinggianAwal = Number(detailData?.nilai_awal || 0);

  const { data: previousData } = useQuery(DataDosisSebelumnyaQuery(Number(id)));

  const id_installasi = useAuthStore.getState().user?.id_installasi;
  const dateServer = time?.toISOString().split("T")[0];
  const {
    data: AllData,
    isLoading: isLoadingAll,
    isFetching: isFetchingAll,
  } = useQuery(
    listReservoarQuery(dateServer, kode, Number(id_installasi), Number(jam))
  );

  const totalData = AllData?.data.length;

  const selesaiData = AllData?.data.filter(
    (item) => item.ppm !== null && item.sisa_khlor !== null
  ).length;

  const {
    handleSubmit,
    setValue,
    reset,
    register,
    formState: { errors },
  } = useForm<InsertDosisRequest>({
    resolver: zodResolver(InsertDosisSchema),
    defaultValues: {
      id: Number(id),
      id_petugas: id_petugas!,
      filename_khlor: null,
      latlong_khlor: "0",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: insertDosisData,
  });

  const handleTakePhoto = async () => {
    try {
      // Ambil lokasi GPS
      await new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const latlong_khlor = `${latitude},${longitude}`;
            setValue("latlong_khlor", latlong_khlor, { shouldValidate: true });
            resolve();
          },
          (error) => {
            console.error("Gagal mendapatkan lokasi:", error);
            resolve();
          }
        );
      });
      setShowCamera(true);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data: InsertDosisRequest) => {
    try {
      if (photoFile) {
        setLoadingUploadedFile(true);
        const secretKey = import.meta.env.VITE_API_SECRET_KEY;

        // Upload file ke API
        const uploadResult = await uploadFileQuery(
          photoFile,
          `DOSIS${id_reservoar}-${Date.now()}`,
          "simpro/trans/foto_dosis",
          secretKey
        );

        data.filename_khlor = uploadResult.url;
        setLoadingUploadedFile(false);
      } else {
        // Jangan timpa, biarin pakai value dari form
        data.filename_khlor = data.filename_khlor ?? "";
      }

      setCachedFormData(data);
      setShowConfirmModal(true);
    } catch (err) {
      console.error("Upload error", err);
      toast.error("Gagal mengunggah foto : " + err);
    }
  };

  useEffect(() => {
    if (time) {
      const pad = (n: number) => n.toString().padStart(2, "0");

      const formatted =
        `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())} ` +
        `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

      setValue("waktu_catat_khlor", formatted, { shouldValidate: true });
    }
  }, [time, setValue]);

  useEffect(() => {
    if (!detailData?.data[0]) return;

    const existing = detailData.data[0];

    reset({
      id: Number(id),
      id_petugas: id_petugas!,
      filename_khlor: existing.file_khlor || null,
      latlong_khlor: existing.latlong_khlor || "0",
      ppm: Number(existing.ppm),
      sisa_khlor: Number(existing.sisa_khlor),
      waktu_catat_khlor: existing.waktu_catat_khlor || undefined,
    });
    if (detailData.data[0]?.file_khlor) {
      setPhotoUrl(detailData.data[0].file_khlor);
    }
  }, [detailData, id, id_petugas, reset]);
  if (isFetchingAll || isLoadingAll || isLoadingDetail || isFetchingDetail)
    return <FormMeterSkeleton />;
  return (
    <div className="w-full p-4 overflow-hidden shadow-none bg-whiteCust rounded-xl">
      {loadingUploadedFile && <FullScreenSpinner />}
      {isPending && <FullScreenSpinner />}
      <BackButton
        to={`/pages/detail-dosis/${kode}`}
        search={{
          jam: jam,
        }}
      />
      <TimeInfo />
      <Total total={totalData} selesai={selesaiData} title="Sisa Khlor" />
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
              }}
              onClose={() => setShowCamera(false)}
            />
          </div>
        </div>
      )}
      <div className="flex items-center justify-center">
        <div className="w-full p-4 space-y-3 bg-white shadow-md rounded-2xl">
          {previousData?.data && previousData.data.length > 0 && (
            <div className="relative mb-5">
              {/* Trigger dropdown */}
              <label htmlFor="" className="block mb-1 text-sm font-medium">
                Gunakan data sebelumnya yang tersedia
              </label>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full px-3 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
              >
                <span>
                  {selected ? selected.nama_reservoar : "Pilih Reservoar"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown list */}
              {open && (
                <ul className="absolute z-10 w-full mt-2 overflow-y-auto bg-white border rounded-lg shadow-lg max-h-60">
                  {previousData.data.map((row: any) => (
                    <li
                      key={row.id}
                      onClick={() => {
                        setSelected(row);
                        setOpen(false);

                        // langsung reset form dengan data yg dipilih
                        reset({
                          id: Number(id),
                          id_petugas: id_petugas!,
                          filename_khlor: row.file_khlor || null,
                          ppm: Number(row.ppm),
                          sisa_khlor: Number(row.sisa_khlor),
                          latlong_khlor: row.latlong_khlor,
                        });

                        if (row.file_khlor) {
                          setPhotoUrl(row.file_khlor);
                          // setIsCopiedFileNtu(true);
                        } else {
                          setPhotoUrl("");
                        }

                        toast.success(
                          `Data dari ${row.nama_reservoar} berhasil disalin`
                        );
                      }}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50"
                    >
                      {row.nama_reservoar}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <h2 className="text-sm font-bold text-center">{nama}</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <button
              type="button"
              onClick={handleTakePhoto}
              className="flex items-center justify-center w-full py-2 space-x-2 text-sm font-medium text-center text-blue-600 bg-blue-100 rounded-lg"
            >
              <CameraIcon className="w-5 h-5 mb-0.5" />
              <span className="text-center">Foto Stand</span>
            </button>

            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Foto Stand"
                className="object-cover w-full mt-4 rounded-md h-96"
              />
            ) : (
              <div className="flex items-center justify-center w-full mt-4 text-sm text-gray-400 bg-gray-200 rounded-md h-36">
                Belum ada foto
              </div>
            )}

            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium">
                Stand PPM
              </label>
              <input
                type="number"
                step="any"
                {...register("ppm")}
                placeholder="Input Stand PPM"
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border ${
                  errors.ppm
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />

              {errors.ppm && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.ppm.message}
                </p>
              )}
            </div>
            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium">
                Stand Sisa Khlor
              </label>
              <input
                type="number"
                step="any"
                placeholder="Input Stand Sisa Khlor"
                {...register("sisa_khlor")}
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border ${
                  errors.sisa_khlor
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />

              {errors.sisa_khlor && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.sisa_khlor.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 mt-4 text-sm font-semibold text-white transition rounded-lg bg-primary hover:bg-primary/80"
              disabled={isPending}
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
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
                            toast.success("Data berhasil disimpan");
                            queryClient.invalidateQueries({
                              queryKey: [
                                "DetailReservoarQuery",
                                Number(id),
                                kode,
                              ],
                            });
                            queryClient.invalidateQueries({
                              queryKey: ["fetchLastActivity", id_petugas],
                            });

                            navigate({
                              to: `/list-data/detail-dosis/${kode}?jam=${jam}`,
                            });
                          },
                          onError: (error: unknown) => {
                            console.error("Gagal menyimpan data:", error);
                            toast.error(
                              "Terjadi kesalahan saat menyimpan data"
                            );
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
          </form>
        </div>
      </div>
    </div>
  );
}
