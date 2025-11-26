import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import TimeInfo from "../../../../components/time-info";
import { CameraIcon } from "@heroicons/react/24/outline";
// import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DetailMeterQuery } from "../../../../queries/meter/detail-meter";
import { uploadFileQuery } from "../../../../queries/upload-file/upload-file";
import { insertMeterData } from "../../../../queries/meter/insert-meter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../../../store/auth";
import {
  InsertMeterSchema,
  type InsertMeterRequest,
} from "../../../../types/requests/meter/insert-meter";
import { queryClient } from "../../../../main";
import toast from "react-hot-toast";
import FullScreenSpinner from "../../../../components/full-screen-spinner";
import { useServerTime } from "../../../../providers/server-time-provider";
import { listDataMeterQuery } from "../../../../queries/meter/list-data-meter";
import FormMeterSkeleton from "../../../../components/skeleton/meter/form-meter-skeleton";
import Total from "../../../../components/ui/total";
import imageCompression from "browser-image-compression";
import BackButton from "../../../../components/back-button";
import CameraWithZoom from "../../../../components/camera-with-zoom";

export const Route = createFileRoute("/__authenticated/form/meter/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { kode } = useSearch({ strict: false });
  const { id_meter } = useSearch({ strict: false });
  const { id_trans } = useSearch({ strict: false });
  const { type } = useSearch({ strict: false });
  const { jam } = useSearch({ strict: false });
  const id_petugas = useAuthStore.getState().user?.id;
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null); // simpan file aslinya
  const [loadingUploadedFile, setLoadingUploadedFile] = useState(false);
  const [kubikasi, setKubikasi] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlertNegative, setShowAlertNegative] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [cachedFormData, setCachedFormData] =
    useState<InsertMeterRequest | null>(null);

  const navigate = useNavigate();
  const time = useServerTime();
  if (!jam) navigate({ to: "/not-found" });
  const {
    data: detailData,
    isLoading: isLoadingDetail,
    isFetching: isFetchingDetail,
  } = useQuery(
    DetailMeterQuery(Number(id), kode, Number(id_meter), jam, id_trans)
  );

  const defaultStandAwal = Number(detailData?.stand_awal || 0);

  const id_installasi = useAuthStore.getState().user?.id_installasi;
  const dateServer = time?.toISOString().split("T")[0];
  const {
    data: AllData,
    isLoading: isLoadingAll,
    isFetching: isFetchingAll,
  } = useQuery(
    listDataMeterQuery(
      dateServer,
      kode,
      Number(id_installasi),
      Number(detailData?.data[0].jam),
      type
    )
  );

  const totalData = AllData?.data.length;
  const selesaiData = AllData?.data.filter(
    (item) =>
      item.waktu_catat !== null &&
      item.st_awal !== null &&
      item.st_akhir !== null
  ).length;

  const {
    handleSubmit,
    setValue,
    reset,
    register,
    formState: { errors },
  } = useForm<InsertMeterRequest>({
    resolver: zodResolver(InsertMeterSchema),
    defaultValues: {
      id: Number(id),
      id_petugas: id_petugas!,
      filename: null,
      latlong: "0",
      stand_awal: 0,
      stand_akhir: undefined,
      waktu_catat: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: insertMeterData,
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation tidak didukung di browser ini.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const latlong = `${latitude},${longitude}`;

        setValue("latlong", latlong);
        toast.success("Lokasi berhasil diambil");
      },
      (error) => {
        console.error("Gagal mendapatkan lokasi:", error.message);
      }
    );
  };

  const handleTakePhoto = () => {
    getLocation(); // tetap jalanin ambil lokasi
    setShowCamera(true);
  };

  // const handleTakePhoto = async () => {
  //   try {
  //     getLocation(); // masih jalanin ambil lokasi

  //     const photo = await Camera.getPhoto({
  //       resultType: CameraResultType.DataUrl,
  //       source: CameraSource.Camera,
  //       quality: 80,
  //     });

  //     const dataUrl = photo.dataUrl!;
  //     setPhotoUrl(dataUrl);

  //     const originalFile = dataURLtoFile(dataUrl, `stand-meter-${id}.jpg`);

  //     const options = {
  //       maxSizeMB: 0.2,
  //       maxWidthOrHeight: 1024,
  //       useWebWorker: true,
  //     };
  //     const compressedFile = await imageCompression(originalFile, options);

  //     setPhotoFile(compressedFile);

  //     toast.success("Foto berhasil diambil");
  //   } catch (err) {
  //     console.error("Camera error", err);
  //     toast.error("Gagal mengambil foto");
  //   }
  // };

  const onSubmit = async (data: InsertMeterRequest) => {
    try {
      // Cek apakah user ambil foto baru
      const isNewPhoto = !!photoFile;
      const existingFile = detailData?.data[0]?.file;

      let finalFilename = existingFile || null;

      if (isNewPhoto && photoFile) {
        // upload hanya kalau ada foto baru
        setLoadingUploadedFile(true);
        const secretKey = import.meta.env.VITE_API_SECRET_KEY;
        // const extension = photoFile.name.split(".").pop() || "jpg";
        const filename = `MTR_${id_meter}-${Date.now()}`;

        const uploadResult = await uploadFileQuery(
          photoFile,
          filename,
          "simpro/trans/foto_mtr",
          secretKey
        );

        finalFilename = uploadResult.url;
        setLoadingUploadedFile(false);
      }

      // simpan ke form
      setValue("filename", finalFilename, { shouldValidate: true });

      // cache data untuk confirm modal
      setCachedFormData({ ...data, filename: finalFilename });
      setShowConfirmModal(true);
    } catch (err) {
      setLoadingUploadedFile(false);
      console.error("Upload error", err);
      toast.error("Gagal mengunggah foto : " + err);
    }
  };

  useEffect(() => {
    if (!time || !detailData) return;

    const pad = (n: number) => n.toString().padStart(2, "0");
    const formatted =
      `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())} ` +
      `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

    // if (!detailData.data[0]?.waktu_catat) {
    setValue("waktu_catat", formatted, { shouldValidate: true });
    // }
  }, [time, detailData, setValue]);

  useEffect(() => {
    if (detailData) {
      reset({
        id: Number(id),
        id_petugas: id_petugas!,
        filename: detailData.data[0]?.file || null,
        latlong: detailData.data[0]?.latlong || "0",
        stand_awal: Number(detailData.stand_awal || 0),
        stand_akhir: Number(detailData.data[0]?.st_akhir || 0),
        waktu_catat: detailData.data[0]?.waktu_catat || "",
      });
      setKubikasi(
        Number(detailData.data[0]?.st_akhir) -
          Number(detailData.data[0]?.st_awal)
      );

      if (detailData.data[0]?.file) {
        setPhotoUrl(detailData.data[0].file);
      }
    }
  }, [detailData, reset, id, id_petugas]);
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
        to={`/pages/detail/${kode}`}
        search={{
          jam: jam,
          ...(type && type !== "undefined" ? { type } : {}),
        }}
      />

      <TimeInfo />
      <Total total={totalData} selesai={selesaiData} title="Stand Meter" />
      <div className="flex items-center justify-center">
        <div className="w-full p-4 space-y-3 bg-white shadow-md rounded-2xl">
          <h2 className="text-sm font-bold text-center">
            Meter {detailData?.data[0].nama_meter_produksi}
          </h2>

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
                alt="Stand Meter"
                className="object-cover w-full mt-4 rounded-md h-96"
              />
            ) : (
              <div className="flex items-center justify-center w-full mt-4 text-sm text-gray-400 bg-gray-200 rounded-md h-36">
                Belum ada foto
              </div>
            )}

            <div className="my-4">
              <label className="block mb-1 text-sm font-medium">
                Stand Awal
              </label>
              <input
                readOnly
                type="number"
                value={defaultStandAwal}
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
                  setValue("stand_akhir", Number(e.target.value), {
                    shouldValidate: true,
                  });

                  const awal = defaultStandAwal;

                  const selisih = num - awal;
                  setKubikasi(selisih);
                  setShowAlertNegative(selisih < 0);
                }}
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border ${
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
                value={kubikasi}
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
                    {kubikasi >= 0 && (
                      <>
                        <p className="text-center">
                          Apakah Anda yakin ingin menyimpan data ini?
                        </p>
                      </>
                    )}

                    {kubikasi < 0 && (
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
                            queryClient.invalidateQueries({
                              queryKey: ["DetailMeterQuery", Number(id), kode],
                            });
                            queryClient.invalidateQueries({
                              queryKey: ["fetchLastActivity", id_petugas],
                            });
                            navigate({
                              to: `/list-data/detail/${kode}?jam=${detailData?.data[0]?.jam}${
                                type && type !== "undefined"
                                  ? `&type=${type}`
                                  : ""
                              }`,
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
