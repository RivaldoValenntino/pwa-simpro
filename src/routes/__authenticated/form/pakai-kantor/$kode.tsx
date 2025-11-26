import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import TimeInfo from "../../../../components/time-info";
import { useEffect, useState } from "react";
import { CameraIcon } from "lucide-react";
import Dropdown, { type Option } from "../../../../components/dropdown";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../../store/auth";
import { listRefMeterKantorQuery } from "../../../../queries/pemakaian-kantor/ref-meter-kantor";
import { getStandAwalMeterKantorQuery } from "../../../../queries/pemakaian-kantor/get-stand-awal";
import toast from "react-hot-toast";
import { uploadFileQuery } from "../../../../queries/upload-file/upload-file";
import imageCompression from "browser-image-compression";
import FullScreenSpinner from "../../../../components/full-screen-spinner";
import {
  InsertPemakaianKantorSchema,
  type InsertPemakaianKantorRequest,
} from "../../../../types/requests/pemakaian-kantor/insert-pemakaian-kantor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertPemakaianMeterKantorData } from "../../../../queries/pemakaian-kantor/insert-meter-kantor";
import { queryClient } from "../../../../main";
import BackButton from "../../../../components/back-button";
import CameraWithZoom from "../../../../components/camera-with-zoom";
export const Route = createFileRoute(
  "/__authenticated/form/pakai-kantor/$kode"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { jam } = useSearch({ strict: false });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [kubikasi, setKubikasi] = useState<number | undefined>(undefined);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { kode } = useParams({ strict: false });
  const [showAlertNegative, setShowAlertNegative] = useState(false);
  const [cachedFormData, setCachedFormData] =
    useState<InsertPemakaianKantorRequest | null>(null);
  const [selectedMeterOption, setSelectedMeterOption] = useState<Option | null>(
    null
  );

  const [loadingUploadedFile, setLoadingUploadedFile] = useState(false);

  const navigate = useNavigate();
  if (!jam) navigate({ to: "/not-found" });
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<InsertPemakaianKantorRequest>({
    resolver: zodResolver(InsertPemakaianKantorSchema),
    defaultValues: {
      id_installasi: Number(useAuthStore.getState().user?.id_installasi),
      id_petugas: Number(useAuthStore.getState().user?.id),
      tanggal: new Date().toISOString().split("T")[0],
      file: "",
    },
  });

  const handleTakePhoto = async () => {
    setShowCamera(true);
  };

  const { data: meterKantorOptions } = useQuery(
    listRefMeterKantorQuery(Number(useAuthStore.getState().user?.id_installasi))
  );

  const meterKantorOptionsMap = meterKantorOptions?.data.map((item) => ({
    label: item.nama_meter_produksi,
    value: item.id,
  })) as Option[];

  const { mutate, isPending } = useMutation({
    mutationFn: insertPemakaianMeterKantorData,
  });

  const onSubmit = async (data: InsertPemakaianKantorRequest) => {
    // if (!photoFile) {
    //   toast.error("Foto stand meter harus diambil terlebih dahulu");
    //   return;
    // }

    try {
      if (photoFile) {
        setLoadingUploadedFile(true);

        const secretKey = import.meta.env.VITE_API_SECRET_KEY;
        // const extension = photoFile.name.split(".").pop() || "jpg";
        const filename = `PAKAI_KANT_${selectedMeterOption?.value}-${Date.now()}`;

        // Upload file ke API
        const uploadResult = await uploadFileQuery(
          photoFile,
          filename,
          "simpro/trans/foto_mtr_kantor",
          secretKey
        );

        // Set URL ke form data
        data.file = uploadResult.url;
      }
      setCachedFormData(data);
      setShowConfirmModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Gagal upload foto");
    } finally {
      setLoadingUploadedFile(false);
    }
  };
  const {
    data: standAwalData,
    isLoading: isLoadingStandAwal,
    isFetching: isFetchingStandAwal,
  } = useQuery({
    ...getStandAwalMeterKantorQuery(
      Number(useAuthStore.getState().user?.id_installasi),
      Number(selectedMeterOption?.value),
      new Date().toISOString().split("T")[0]
    ),
    enabled: !!selectedMeterOption?.value,
  });
  useEffect(() => {
    if (isLoadingStandAwal || isFetchingStandAwal) {
      toast.loading("Mengambil data stand awal meter...", { id: "standAwal" });
    } else {
      toast.dismiss("standAwal");
    }
  }, [isLoadingStandAwal, isFetchingStandAwal]);

  useEffect(() => {
    if (
      standAwalData?.data?.stand_akhir != null ||
      standAwalData?.data?.stand_akhir != undefined
    ) {
      setValue("stand_awal", Number(standAwalData.data.stand_akhir), {
        shouldValidate: true,
      });
    }
  }, [standAwalData, setValue]);

  return (
    <div className="w-full p-4 bg-whiteCust rounded-xl">
      {loadingUploadedFile && <FullScreenSpinner />}
      {isPending && <FullScreenSpinner />}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 w-dvw h-dvh">
          <div className="relative z-50 mx-auto bg-black rounded-lg ">
            <CameraWithZoom
              onCapture={async (file, dataUrl) => {
                console.log("dataUrl:", dataUrl); // ✅ sekarang ada

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
      <BackButton to={`/list-data/detail-pakai-kntr/${kode}?jam=${jam}`} />
      <TimeInfo />
      <div className="flex items-center justify-center">
        <div className="w-full p-4 space-y-3 bg-white shadow-md rounded-2xl">
          <h2 className="text-sm font-bold text-center">
            Catat Pemakaian Meter Kantor
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <button
              type="button"
              onClick={handleTakePhoto}
              className="flex items-center justify-center w-full py-2 space-x-2 text-sm font-medium text-center text-blue-600 bg-blue-100 rounded-t-lg"
            >
              <CameraIcon className="w-5 h-5 mb-0.5" />
              <span className="text-center">Foto Stand</span>
            </button>

            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Stand Meter"
                className="object-cover w-full rounded-b-md h-96"
              />
            ) : (
              <div className="flex items-center justify-center w-full text-sm text-gray-400 bg-gray-200 rounded-b-md h-36">
                Belum ada foto
              </div>
            )}

            <Dropdown
              isError={!!errors.id_meter_pemakaian}
              label="Jenis Meter"
              options={meterKantorOptionsMap || []}
              selected={selectedMeterOption || undefined}
              onChange={(option) => {
                register("id_meter_pemakaian"); // daftar dulu
                setSelectedMeterOption(option);
                setValue("id_meter_pemakaian", Number(option?.value), {
                  shouldValidate: true,
                });
              }}
            />

            {errors.id_meter_pemakaian && (
              <p className="mt-1 text-xs text-red-500">
                {errors.id_meter_pemakaian.message}
              </p>
            )}

            <div className="my-4">
              <label className="block mb-1 text-sm font-medium">
                Stand Awal
              </label>
              <input
                readOnly
                type="number"
                {...register("stand_awal", {
                  valueAsNumber: true,
                })}
                value={standAwalData?.data?.stand_akhir ?? 0}
                placeholder="Input Stand Awal Meter"
                className={`w-full px-3 py-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-300 rounded-md cursor-not-allowed`}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Stand Akhir
              </label>
              <input
                type="number"
                step="any"
                {...register("stand_akhir", {
                  valueAsNumber: true,
                })}
                placeholder="Input Stand Akhir Meter"
                onChange={(e) => {
                  const num = Number(e.target.value);
                  setValue("stand_akhir", num);

                  const awal = Number(standAwalData?.data?.stand_akhir ?? 0);

                  const selisih = num - awal;
                  setKubikasi(selisih);
                  setShowAlertNegative(selisih < 0);
                }}
                className={`w-full px-3 py-2 text-sm text-gray-700 rounded-md border ${
                  errors.stand_akhir
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />

              {errors.stand_akhir && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.stand_akhir.message}
                </p>
              )}

              {showAlertNegative && (
                <p className="px-2 py-1 mt-4 text-xs text-yellow-600 bg-yellow-100 rounded">
                  ⚠️ Stand akhir lebih kecil dari stand awal!
                </p>
              )}
            </div>
            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium">Kubikasi</label>
              <input
                value={kubikasi || 0}
                readOnly
                className={`w-full px-3 py-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-300 rounded-md cursor-not-allowed`}
              />
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
                    <>
                      <p className="text-center">
                        Apakah Anda yakin ingin menyimpan data ini?
                      </p>
                    </>

                    {(kubikasi ?? 0) < 0 && (
                      <p className="px-3 py-2 text-sm text-center text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-md">
                        ⚠️ Kubikasi bernilai negatif anda yakin ingin menyimpan
                        data?
                      </p>
                    )}
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
                            // setTimeout(() => {
                            // queryClient.invalidateQueries({
                            //   queryKey: ["DetailMeterQuery", Number(id), kode],
                            // });
                            queryClient.invalidateQueries({
                              queryKey: [
                                "fetchLastActivity",
                                Number(useAuthStore.getState().user?.id),
                              ],
                            });
                            navigate({
                              to: `/pages/detail-pakai-kntr/${kode}`,
                              search: {
                                jam: Number(jam),
                              },
                            });
                            // }, 2000);
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
