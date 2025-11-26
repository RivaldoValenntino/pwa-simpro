/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { useAuthStore } from "../../../../store/auth";
import { useEffect, useState } from "react";
import {
  InsertKwluaSchema,
  type InsertKwluaRequest,
} from "../../../../types/requests/kwlua/insert-kwlua";
import { useServerTime } from "../../../../hooks/useServerTime";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import TimeInfo from "../../../../components/time-info";
import FullScreenSpinner from "../../../../components/full-screen-spinner";
import { CameraIcon } from "@heroicons/react/24/outline";
import { queryClient } from "../../../../main";
import { insertKwluaData } from "../../../../queries/kwlua/insert-kwlua";
import Total from "../../../../components/ui/total";
import { uploadFotoKwlua } from "../../../../utils/upload-foto-kwlua";
import { listDataKwluaQuery } from "../../../../queries/kwlua/list-data-kwlua";
import FormMeterSkeleton from "../../../../components/skeleton/meter/form-meter-skeleton";
import { DetailKwluaQuery } from "../../../../queries/kwlua/detail-kwlua";
import BackButton from "../../../../components/back-button";
import { DataSebelumnyaKwluaQuery } from "../../../../queries/kwlua/get-data-sebelumnya";
// import type { DetailKwluaResponses } from "../../../../types/responses/kwlua/detail-kwlua";
import { ChevronDown } from "lucide-react";
import CameraWithZoom from "../../../../components/camera-with-zoom";
export const Route = createFileRoute("/__authenticated/form/kwlua/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { type } = useSearch({ strict: false });
  const { jam } = useSearch({ strict: false });
  const { kode_trans } = useSearch({ strict: false });
  const { id_wtp } = useSearch({ strict: false });
  const id_petugas = useAuthStore.getState().user?.id;
  const [photoUrlNtu, setPhotoUrlNtu] = useState<string | null>(null);
  const [photoUrlPh, setPhotoUrlPh] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [loadingUploadedFile, setLoadingUploadedFile] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // const [isCopiedFileNtu, setIsCopiedFileNtu] = useState(false);
  // const [isCopiedFilePh, setIsCopiedFilePh] = useState(false);

  const [showCameraNtu, setShowCameraNtu] = useState(false);
  const [showCameraPh, setShowCameraPh] = useState(false);
  const [cachedFormData, setCachedFormData] =
    useState<InsertKwluaRequest | null>(null);

  const [isNewPhotoNtu, setIsNewPhotoNtu] = useState(false);
  const [isNewPhotoPh, setIsNewPhotoPh] = useState(false);
  const navigate = useNavigate();
  const time = useServerTime();
  if (!jam) navigate({ to: "/not-found" });
  const { data: previousData } = useQuery(
    DataSebelumnyaKwluaQuery(Number(id), type)
  );

  const {
    data: detailData,
    isLoading: isLoadingDetail,
    isFetching: isFetchingDetail,
  } = useQuery(DetailKwluaQuery(Number(id), type));
  const id_installasi = useAuthStore.getState().user?.id_installasi;
  const dateServer = time?.toISOString().split("T")[0];
  const {
    data: ListData,
    isLoading,
    isFetching,
  } = useQuery(
    listDataKwluaQuery(dateServer, kode_trans, Number(id_installasi), jam)
  );
  const totalData = ListData?.data.length;
  const selesaiData = ListData?.data.filter(
    (item) =>
      item.air_baku_ntu !== null &&
      item.air_baku_ph !== null &&
      item.air_sediment_ntu !== null &&
      item.air_sediment_ph !== null &&
      item.air_produksi_ntu !== null &&
      item.air_produksi_ph !== null
  ).length;
  const {
    handleSubmit,
    setValue,
    reset,
    register,
    formState: { errors },
  } = useForm<InsertKwluaRequest>({
    resolver: zodResolver(InsertKwluaSchema),
    defaultValues: {
      id: Number(id),
      id_petugas: id_petugas!,
      file_ntu: null,
      file_ph: null,
      type: type,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: insertKwluaData,
  });

  const handleTakePhotoNtu = async () => {
    setShowCameraNtu(true);
  };

  const handleTakePhotoPh = async () => {
    setShowCameraPh(true);
  };

  const onSubmit = async (data: InsertKwluaRequest) => {
    try {
      setLoadingUploadedFile(true);

      // --- handle file NTU ---
      if (photoUrlNtu) {
        if (isNewPhotoNtu) {
          // foto baru → upload
          const resNtu = await uploadFotoKwlua({
            dataUrl: photoUrlNtu,
            idWtp: id_wtp!,
            label: "ntu",
            id,
          });
          data.file_ntu = resNtu.url;
        } else {
          // foto lama → langsung pakai
          data.file_ntu = photoUrlNtu;
        }
      } else {
        data.file_ntu = null;
      }

      // --- handle file PH ---
      if (photoUrlPh) {
        if (isNewPhotoPh) {
          const resPh = await uploadFotoKwlua({
            dataUrl: photoUrlPh,
            idWtp: id_wtp!,
            label: "ph",
            id,
          });
          data.file_ph = resPh.url;
        } else {
          data.file_ph = photoUrlPh;
        }
      } else {
        data.file_ph = null;
      }

      setCachedFormData(data);
      setShowConfirmModal(true);
    } catch (error) {
      console.error("Upload file gagal:", error);
      toast.error("Gagal mengunggah foto : " + error);
    } finally {
      setLoadingUploadedFile(false);
    }
  };

  useEffect(() => {
    if (time) {
      const pad = (n: number) => n.toString().padStart(2, "0");

      const formatted =
        `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())} ` +
        `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

      setValue("waktu_catat", formatted, { shouldValidate: true });
    }
  }, [time, setValue]);
  // const getDefaultValue = (
  //   type: "air_baku" | "air_sediment" | "air_produksi",
  //   detailData: DetailKwluaResponses["data"][0]
  // ) => {
  //   const suffixes = ["ntu", "ph"] as const;

  //   const result: {
  //     ntu: string | null;
  //     ph: string | null;
  //     file_ntu: string | null;
  //     file_ph: string | null;
  //   } = {
  //     ntu: null,
  //     ph: null,
  //     file_ntu: null,
  //     file_ph: null,
  //   };

  //   suffixes.forEach((suffix) => {
  //     const valueKey = `${type}_${suffix}` as keyof typeof detailData;
  //     const fileKey = `file_${type}_${suffix}` as keyof typeof detailData;

  //     result[suffix] = detailData?.[valueKey] ?? null;
  //     result[`file_${suffix}` as keyof typeof result] =
  //       detailData?.[fileKey] ?? null;
  //   });

  //   return result;
  // };

  useEffect(() => {
    if (!detailData?.data?.[0] || !type) return;

    // const defaults = getDefaultValue(type as any, detailData.data[0]);

    // if (defaults.ntu) {
    //   const formatted = parseInt(defaults.ntu).toLocaleString("id-ID");
    //   setNtuValue(formatted);
    //   setValue("ntu", parseInt(defaults.ntu), { shouldValidate: true });
    // }

    // if (defaults.ph) {
    //   const formatted = parseInt(defaults.ph).toLocaleString("id-ID");
    //   setPhValue(formatted);
    //   setValue("ph", parseInt(defaults.ph), { shouldValidate: true });
    // }

    // if (defaults.file_ntu) {
    //   setPhotoUrlNtu(defaults.file_ntu);
    //   setValue("file_ntu", defaults.file_ntu, { shouldValidate: true });
    // }

    // if (defaults.file_ph) {
    //   setPhotoUrlPh(defaults.file_ph);
    //   setValue("file_ph", defaults.file_ph, { shouldValidate: true });
    // }
  }, [detailData, type, setValue]);

  useEffect(() => {
    if (detailData) {
      reset({
        id: Number(id),
        id_petugas: id_petugas!,
        ntu: Number(detailData.data[0]?.ntu),
        ph: Number(detailData.data[0]?.ph),
        file_ntu: detailData.data[0]?.file_ntu || "",
        file_ph: detailData.data[0]?.file_ph || "",
        waktu_catat: detailData.data[0]?.waktu_ntu || "",
        type: type,
      });

      if (detailData.data[0]?.file_ntu) {
        setPhotoUrlNtu(detailData.data[0].file_ntu);
        setIsNewPhotoNtu(false); // masih foto lama
      }
      if (detailData.data[0]?.file_ph) {
        setPhotoUrlPh(detailData.data[0].file_ph);
        setIsNewPhotoPh(false);
      }
    }
  }, [detailData, reset, id, id_petugas, type]);

  if (isFetching || isLoading || isFetchingDetail || isLoadingDetail)
    return <FormMeterSkeleton />;
  return (
    <div className="w-full p-4 overflow-hidden shadow-none bg-whiteCust rounded-xl">
      {loadingUploadedFile && <FullScreenSpinner />}
      {isPending && <FullScreenSpinner />}
      <BackButton
        to={`/pages/detail-kwl-ua/${kode_trans}`}
        search={{
          jam: jam,
        }}
      />
      <TimeInfo />
      <Total total={totalData} selesai={selesaiData} title="Kwalitas" />
      {showCameraNtu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 w-dvw h-dvh">
          <div className="relative z-50 mx-auto bg-black rounded-lg ">
            <CameraWithZoom
              onCapture={async (file, dataUrl) => {
                setPhotoUrlNtu(dataUrl);
                console.log(file);

                setIsNewPhotoNtu(true); // tandai bahwa ini foto baru
                toast.success("Foto berhasil diambil");
                setShowCameraNtu(false);
              }}
              onClose={() => setShowCameraNtu(false)}
            />
          </div>
        </div>
      )}
      {showCameraPh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 w-dvw h-dvh">
          <div className="relative z-50 mx-auto bg-black rounded-lg ">
            <CameraWithZoom
              onCapture={async (file, dataUrl) => {
                setPhotoUrlPh(dataUrl);
                console.log(file);

                setIsNewPhotoPh(true);
                toast.success("Foto berhasil diambil");
                setShowCameraPh(false);
              }}
              onClose={() => setShowCameraPh(false)}
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
                <span>{selected ? selected.nama_wtp : "Pilih WTP..."}</span>
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
                          ntu: Number(row.ntu),
                          ph: Number(row.ph),
                          file_ntu: row.file_ntu || "",
                          file_ph: row.file_ph || "",
                          waktu_catat: row.waktu_ntu || "",
                          type: type,
                        });

                        if (row.file_ntu) {
                          setPhotoUrlNtu(row.file_ntu);
                          // setIsCopiedFileNtu(true);
                        }
                        if (row.file_ph) {
                          setPhotoUrlPh(row.file_ph);
                          // setIsCopiedFilePh(true);
                        }

                        toast.success(
                          `Data dari ${row.nama_wtp} berhasil disalin`
                        );
                      }}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50"
                    >
                      {row.nama_wtp}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <h2 className="font-bold text-center text-md">
            {detailData?.data?.[0]?.nama_wtp}
          </h2>

          <h2 className="text-sm font-semibold text-center capitalize">
            Kwalitas {type?.replace("_", " ")}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <button
              type="button"
              onClick={handleTakePhotoNtu}
              className="flex items-center justify-center w-full py-2 space-x-2 text-sm font-medium text-center text-blue-600 bg-blue-100 rounded-t-lg"
            >
              <CameraIcon className="w-5 h-5 mb-0.5" />
              <span className="text-center">Foto Alat Indikator</span>
            </button>

            {photoUrlNtu ? (
              <img
                src={photoUrlNtu}
                alt="Foto Alat Indikator"
                className="object-cover w-full rounded-b-lg h-96"
              />
            ) : (
              <div className="flex items-center justify-center w-full text-sm text-gray-400 bg-gray-200 rounded-b-lg h-36">
                Belum ada foto
              </div>
            )}

            <div className="mt-2 mb-4">
              <label className="block mb-1 text-sm font-medium">
                Nilai NTU
              </label>
              <input
                type="number"
                step={"any"}
                {...register("ntu")}
                placeholder="Input Nilai NTU"
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border ${
                  errors.ntu
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />

              {errors.ntu && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.ntu.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleTakePhotoPh}
              className="flex items-center justify-center w-full py-2 space-x-2 text-sm font-medium text-center text-blue-600 bg-blue-100 rounded-t-lg"
            >
              <CameraIcon className="w-5 h-5 mb-0.5" />
              <span className="text-center">Foto Alat Indikator</span>
            </button>

            {photoUrlPh ? (
              <img
                src={photoUrlPh}
                alt="Foto Alat Indikator"
                className="object-cover w-full rounded-b-lg h-96"
              />
            ) : (
              <div className="flex items-center justify-center w-full text-sm text-gray-400 bg-gray-200 rounded-b-lg h-36">
                Belum ada foto
              </div>
            )}

            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium">Nilai PH</label>
              <input
                type="number"
                step={"any"}
                {...register("ph")}
                placeholder="Input Nilai PH"
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border ${
                  errors.ph
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />

              {errors.ph && (
                <p className="mt-1 text-xs text-red-500">{errors.ph.message}</p>
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
                              queryKey: ["fetchLastActivity", id_petugas],
                            });
                            navigate({
                              to: `/pages/detail-kwl-ua/${kode_trans}`,
                              search: {
                                jam: Number(jam),
                              },
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
