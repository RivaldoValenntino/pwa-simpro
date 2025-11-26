import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { useAuthStore } from "../../../../store/auth";
import { useEffect, useState } from "react";
import {
  InsertKimiaSchema,
  type InsertKimiaRequest,
} from "../../../../types/requests/kimia/insert-kimia";
import { useServerTime } from "../../../../hooks/useServerTime";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { uploadFileQuery } from "../../../../queries/upload-file/upload-file";
import toast from "react-hot-toast";
import FullScreenSpinner from "../../../../components/full-screen-spinner";
import TimeInfo from "../../../../components/time-info";
import { CameraIcon } from "@heroicons/react/24/outline";
import { queryClient } from "../../../../main";
import Total from "../../../../components/ui/total";
import { insertKimiaData } from "../../../../queries/kimia/insert-kimia";
import { useMutation, useQuery } from "@tanstack/react-query";
import { listDataKimiaQuery } from "../../../../queries/kimia/list-data-kimia";
import { DetailKimiaQuery } from "../../../../queries/kimia/detail-kimia";
import FormMeterSkeleton from "../../../../components/skeleton/meter/form-meter-skeleton";
import imageCompression from "browser-image-compression";
import BackButton from "../../../../components/back-button";
import CameraWithZoom from "../../../../components/camera-with-zoom";
export const Route = createFileRoute("/__authenticated/form/kimia/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { kode } = useSearch({ strict: false });
  const { jam } = useSearch({ strict: false });
  const { type } = useSearch({ strict: false });
  const { id_wtp } = useSearch({ strict: false });
  const id_petugas = useAuthStore.getState().user?.id;
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loadingUploadedFile, setLoadingUploadedFile] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cachedFormData, setCachedFormData] =
    useState<InsertKimiaRequest | null>(null);

  const navigate = useNavigate();
  const time = useServerTime();
  if (!jam) navigate({ to: "/not-found" });
  const {
    data: detailData,
    isLoading: isLoadingDetail,
    isFetching: isFetchingDetail,
  } = useQuery(DetailKimiaQuery(Number(id), kode));

  // start mapping by type
  type KimiaType = "alum" | "pac" | "sodaash" | "kaporit";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pickKimiaByType = (d: any, t: KimiaType) => {
    const map = {
      alum: {
        dosis: d.alum_dosis,
        dosring: d.alum_dosring,
        cons: d.alum_cons,
        file: d.file_alum,
        waktu: d.waktu_catat_alum,
      },
      pac: {
        dosis: d.pac_dosis,
        dosring: d.pac_dosring,
        cons: d.pac_cons,
        file: d.file_pac,
        waktu: d.waktu_catat_pac,
      },
      sodaash: {
        dosis: d.sodaash_dosis,
        dosring: d.sodaash_dosring,
        cons: d.sodaash_const,
        file: d.file_sodaash,
        waktu: d.waktu_catat_sodaash,
      },
      kaporit: {
        dosis: d.kaporit_dosis,
        dosring: d.kaporit_dosring,
        cons: d.kaporit_const,
        file: d.file_kaporit,
        waktu: d.waktu_catat_kaporit,
      },
    } as const;

    return map[t];
  };

  // end mapping
  const id_installasi = useAuthStore.getState().user?.id_installasi;
  const dateServer = time?.toISOString().split("T")[0];
  const {
    data: ListData,
    isLoading: isLoadingAll,
    isFetching: isFetchingAll,
  } = useQuery(
    listDataKimiaQuery(dateServer, kode, Number(id_installasi), jam)
  );

  const totalData = ListData?.data.length;
  const selesaiData = ListData?.data.filter(
    (item) => item.id_petugas !== null
  ).length;

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InsertKimiaRequest>({
    resolver: zodResolver(InsertKimiaSchema),
    defaultValues: {
      id: Number(id),
      id_petugas: id_petugas!,
      filename: null,
      type: type,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: insertKimiaData,
  });

  const handleTakePhoto = async () => {
    setShowCamera(true);
  };

  const onSubmit = async (data: InsertKimiaRequest) => {
    try {
      setLoadingUploadedFile(true);

      const d = detailData?.data?.[0];
      const existingFile = d
        ? pickKimiaByType(d, type as KimiaType).file
        : null;

      // default pakai file lama jika ada
      let finalFilename = existingFile ?? "";

      // kalau user ambil foto baru → upload & override
      if (photoFile) {
        const secretKey = import.meta.env.VITE_API_SECRET_KEY;
        const uploadResult = await uploadFileQuery(
          photoFile,
          `KMIA_${id_wtp}-${Date.now()}`,
          "simpro/trans/foto_kmia",
          secretKey
        );
        finalFilename = uploadResult.url;
      }

      data.filename = finalFilename;

      setCachedFormData(data);
      setShowConfirmModal(true);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Gagal mengunggah foto : " + err);
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
  useEffect(() => {
    const d = detailData?.data?.[0];
    if (!d) return;

    const sel = pickKimiaByType(d, type as KimiaType);

    reset({
      id: Number(id),
      id_petugas: id_petugas!,
      type,
      dosis: Number(sel.dosis),
      dosring: Number(sel.dosring),
      cons: Number(sel.cons),
      filename: sel.file ?? null,
      waktu_catat: sel.waktu ?? "",
    });

    if (sel.file) setPhotoUrl(sel.file);
    // 👇 tambahin guard biar gak ke-trigger terus
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailData]);

  if (isFetchingAll || isFetchingDetail || isLoadingAll || isLoadingDetail)
    return <FormMeterSkeleton />;
  return (
    <div className="w-full p-4 overflow-hidden shadow-none bg-whiteCust rounded-xl">
      {loadingUploadedFile && <FullScreenSpinner />}
      {isPending && <FullScreenSpinner />}
      <BackButton
        to={`/pages/detail-kimia/${kode}`}
        search={{
          jam: jam,
        }}
      />
      <TimeInfo />
      <Total total={totalData} selesai={selesaiData} title="Kwalitas (Kimia)" />
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
          <h2 className="text-sm font-bold text-center">
            {detailData?.data[0].nama_wtp}
          </h2>
          <h2 className="text-sm font-semibold text-center capitalize">
            Kwalitas Kimia {type?.replace("_", " ")}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium">
                Dosis PPM
              </label>
              <input
                step={"any"}
                type="number"
                placeholder="Input Nilai Dosis PPM"
                {...register("dosis")}
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border ${
                  errors.dosis
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />
            </div>
            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium">Dosring</label>
              <input
                step={"any"}
                type="number"
                placeholder="Input Nilai Dosring"
                {...register("dosring")}
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border ${
                  errors.dosring
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />
            </div>
            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium">
                Consentrasi
              </label>
              <input
                step={"any"}
                type="number"
                placeholder="Input Nilai Consentrasi"
                {...register("cons")}
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border ${
                  errors.cons
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />
            </div>
            <button
              type="button"
              onClick={handleTakePhoto}
              className="flex items-center justify-center w-full py-2 mt-4 space-x-2 text-sm font-medium text-center text-blue-600 bg-blue-100 rounded-t-lg"
            >
              <CameraIcon className="w-5 h-5 mb-0.5" />
              <span className="text-center">Foto Alat Indikator</span>
            </button>

            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Stand Meter"
                className="object-cover w-full rounded-b-lg h-96"
              />
            ) : (
              <div className="flex items-center justify-center w-full text-sm text-gray-400 bg-gray-200 rounded-b-lg h-36">
                Belum ada foto
              </div>
            )}
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
                              to: `/list-data/detail-kimia/${kode}?jam=${jam}`,
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
