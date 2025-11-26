import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { useAuthStore } from "../../../../store/auth";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useServerTime } from "../../../../hooks/useServerTime";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DetailWtpDebtQuery } from "../../../../queries/wtp-debt/detail-wtp-debt";
import { listWtpDebtQuery } from "../../../../queries/wtp-debt/list-wtp-debt";
import { uploadFileQuery } from "../../../../queries/upload-file/upload-file";
import FormMeterSkeleton from "../../../../components/skeleton/meter/form-meter-skeleton";
import TimeInfo from "../../../../components/time-info";
import FullScreenSpinner from "../../../../components/full-screen-spinner";
import { CameraIcon } from "@heroicons/react/24/outline";
import { queryClient } from "../../../../main";
import toast from "react-hot-toast";
import {
  InsertWtpDebtSchema,
  type InsertWtpDebtRequest,
} from "../../../../types/requests/wtp-debt/insert-wtp-debt";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertWtpDebt } from "../../../../queries/wtp-debt/insert-wtp-debt";
import Total from "../../../../components/ui/total";
import imageCompression from "browser-image-compression";
import BackButton from "../../../../components/back-button";
import CameraWithZoom from "../../../../components/camera-with-zoom";
export const Route = createFileRoute("/__authenticated/form/wtp-debt/$id")({
  component: RouteComponent,
  validateSearch: z.object({
    kode: z.string(),
    id_wtp: z.number(),
    jam: z.number(),
    id_trans: z.number(),
  }),
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { kode } = useSearch({ strict: false });
  const { id_wtp } = useSearch({ strict: false });
  const { id_trans } = useSearch({ strict: false });
  const { jam } = useSearch({ strict: false });
  const id_petugas = useAuthStore.getState().user?.id;
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loadingUploadedFile, setLoadingUploadedFile] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cachedFormData, setCachedFormData] =
    useState<InsertWtpDebtRequest | null>(null);

  const navigate = useNavigate();
  const time = useServerTime();
  if (!jam) navigate({ to: "/not-found" });
  const {
    data: detailData,
    isLoading: isLoadingDetail,
    isFetching: isFetchingDetail,
  } = useQuery(
    DetailWtpDebtQuery(Number(id), kode, Number(id_wtp), jam, id_trans)
  );

  const id_installasi = useAuthStore.getState().user?.id_installasi;
  const dateServer = time?.toISOString().split("T")[0];
  const {
    data: AllData,
    isLoading: isLoadingAll,
    isFetching: isFetchingAll,
  } = useQuery(
    listWtpDebtQuery(
      dateServer,
      kode,
      Number(id_installasi),
      Number(detailData?.data[0].jam)
    )
  );

  const totalData = AllData?.data.length;
  const selesaiData = AllData?.data.filter(
    (item) => item.waktu_catat !== null && item.debit_ld !== null
  ).length;

  const {
    handleSubmit,
    setValue,
    reset,
    register,
    formState: { errors },
  } = useForm<InsertWtpDebtRequest>({
    resolver: zodResolver(InsertWtpDebtSchema),
    defaultValues: {
      id: Number(id),
      id_petugas: id_petugas!,
      filename: null,
      latlong: "0",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: insertWtpDebt,
  });

  const secretKey = import.meta.env.VITE_API_SECRET_KEY;
  const handleTakePhoto = async () => {
    try {
      await new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const latlong = `${latitude},${longitude}`;
            setValue("latlong", latlong, { shouldValidate: true });
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
      console.error("Camera or upload error", err);
    }
  };

  const onSubmit = async (data: InsertWtpDebtRequest) => {
    try {
      if (photoFile) {
        setLoadingUploadedFile(true);
        const uploadResult = await uploadFileQuery(
          photoFile!,
          `WTP_DEBT_${id_wtp}-${Date.now()}`,
          "simpro/trans/foto_wtp_debt",
          secretKey
        );
        data.filename = uploadResult.url;
        setLoadingUploadedFile(false);
      } else {
        data.filename = detailData?.data?.[0]?.file ?? "";
      }
      setCachedFormData(data);
      setShowConfirmModal(true);
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };
  useEffect(() => {
    if (!detailData?.data[0]) return;

    const existing = detailData.data[0];

    reset({
      id: Number(id),
      id_petugas: id_petugas!,
      filename: existing.file || null,
      latlong: existing.latlong || "0",
      debit_ld: Number(existing.debit_ld),
      waktu_catat: existing.waktu_catat || undefined,
    });
    if (detailData.data[0]?.file) {
      setPhotoUrl(detailData.data[0].file);
    }
  }, [detailData, id, id_petugas, reset]);
  useEffect(() => {
    if (time) {
      const pad = (n: number) => n.toString().padStart(2, "0");

      const formatted =
        `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())} ` +
        `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

      setValue("waktu_catat", formatted, { shouldValidate: true });
    }
  }, [time, setValue]);

  if (isFetchingAll || isFetchingDetail || isLoadingAll || isLoadingDetail)
    return <FormMeterSkeleton />;
  return (
    <div className="w-full p-4 overflow-hidden shadow-none bg-whiteCust rounded-xl">
      {loadingUploadedFile && <FullScreenSpinner />}
      {isPending && <FullScreenSpinner />}
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
      <BackButton
        to={`/pages/detail-wtp-debt/${kode}`}
        search={{
          jam: jam,
        }}
      />
      <TimeInfo />
      <Total
        total={totalData}
        selesai={selesaiData}
        title="Debit Air Baku(L/D)"
      />
      <div className="flex items-center justify-center">
        <div className="w-full p-4 space-y-3 bg-white shadow-md rounded-2xl">
          <h2 className="text-sm font-bold text-center">
            {detailData?.data[0].nama_wtp}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <button
              type="button"
              onClick={handleTakePhoto}
              className="flex items-center justify-center w-full py-2 space-x-2 text-sm font-medium text-center text-blue-600 bg-blue-100 rounded-lg"
            >
              <CameraIcon className="w-5 h-5 mb-0.5" />
              <span className="text-center">Foto WTP</span>
            </button>

            {photoUrl ? (
              <img
                src={photoUrl}
                alt="WTP DEBT"
                className="object-cover w-full mt-4 rounded-md h-96"
              />
            ) : (
              <div className="flex items-center justify-center w-full mt-4 text-sm text-gray-400 bg-gray-200 rounded-md h-36">
                Belum ada foto
              </div>
            )}

            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium">Debit</label>
              <input
                type="number"
                step="any"
                {...register("debit_ld")}
                placeholder="Input Debit"
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border ${
                  errors.debit_ld
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />

              {errors.debit_ld && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.debit_ld.message}
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
                                "DetailWtpDebtQuery",
                                Number(id),
                                kode,
                              ],
                            });
                            queryClient.invalidateQueries({
                              queryKey: ["fetchLastActivity", id_petugas],
                            });
                            navigate({
                              to: `/list-data/detail-wtp-debt/${kode}?jam=${detailData?.data[0].jam}`,
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
