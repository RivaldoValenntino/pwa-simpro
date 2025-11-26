import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import Total from "../../../../components/ui/total";
import TimeInfo from "../../../../components/time-info";
import { useEffect, useState } from "react";
import { CameraIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "../../../../store/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NilaiAwalPlnQuery } from "../../../../queries/meter-pln/get-nilai-awal";
import { z } from "zod";
import { useServerTime } from "../../../../providers/server-time-provider";
import FormMeterSkeleton from "../../../../components/skeleton/meter/form-meter-skeleton";
import { uploadFileQuery } from "../../../../queries/upload-file/upload-file";
import toast from "react-hot-toast";
import {
  InsertMeterPLNSchema,
  type InsertMeterPLNRequest,
} from "../../../../types/requests/meter-pln/insert-meter-pln";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertMeterPlnData } from "../../../../queries/meter-pln/insert-meter-pln";
import FullScreenSpinner from "../../../../components/full-screen-spinner";
import { queryClient } from "../../../../main";
import imageCompression from "browser-image-compression";
import BackButton from "../../../../components/back-button";
import { DetailMeterPlnQuery } from "../../../../queries/meter-pln/detail-meter-pln";
import { getSelectedField } from "../../../../utils/helper";
import CameraWithZoom from "../../../../components/camera-with-zoom";
export const Route = createFileRoute("/__authenticated/form/meter-pln/$id")({
  component: RouteComponent,
  validateSearch: z.object({
    kode_trans: z.string(),
    id_meter: z.number(),
    jam: z.number(),
    type: z.string(),
    total: z.number(),
    selesai: z.number(),
  }),
});

function RouteComponent() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const time = useServerTime();
  const tanggal = time?.toISOString().split("T")[0];
  const [loadingUploadedFile, setLoadingUploadedFile] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // const [showAlertNegative, setShowAlertNegative] = useState(false);
  // const [akumulasi, setAkumulasi] = useState<number | null>(0);
  const id_petugas = useAuthStore.getState().user?.id;
  const { id } = useParams({ strict: false });
  const { kode_trans, id_meter, jam, type, total, selesai } = useSearch({
    strict: false,
  });
  const navigate = useNavigate();
  if (!jam) navigate({ to: "/not-found" });
  const id_installasi = useAuthStore.getState().user?.id_installasi;
  const [cachedFormData, setCachedFormData] =
    useState<InsertMeterPLNRequest | null>(null);
  const {
    data: NilaiAwal,
    isLoading,
    isFetching,
  } = useQuery(
    NilaiAwalPlnQuery(
      Number(id_installasi),
      tanggal,
      kode_trans,
      jam,
      id_meter,
      type
    )
  );

  const { data: detailData } = useQuery(
    DetailMeterPlnQuery(Number(id), kode_trans)
  );

  const {
    handleSubmit,
    setValue,
    reset,
    register,
    formState: { errors },
  } = useForm<InsertMeterPLNRequest>({
    resolver: zodResolver(InsertMeterPLNSchema),
    defaultValues: {
      id: Number(id),
      id_petugas: id_petugas,
      nilai: 0,
      filename: null,
      latlong: "0",
      type: type,
    },
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

  const handleTakePhoto = async () => {
    try {
      getLocation();
      setShowCamera(true);
    } catch (err) {
      console.error("Camera error", err);
    }
  };

  const onSubmit = async (data: InsertMeterPLNRequest) => {
    try {
      if (photoFile) {
        setLoadingUploadedFile(true);
        const secretKey = import.meta.env.VITE_API_SECRET_KEY;
        // const extension = photoFile.name.split(".").pop() || "jpg";
        const filename = `MTR_PLN_${id_meter}-${Date.now()}`;

        const uploadResult = await uploadFileQuery(
          photoFile,
          filename,
          "simpro/trans/foto_meter_pln",
          secretKey
        );

        setLoadingUploadedFile(false);
        data.filename = uploadResult.url;
      } else {
        const selected = getSelectedField(detailData?.data[0], type);
        data.filename = selected?.file || "";
      }

      setCachedFormData(data);
      setShowConfirmModal(true);
    } catch (err) {
      setLoadingUploadedFile(false);
      console.error("Upload error", err);
      toast.error("Gagal mengunggah foto : " + err);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: insertMeterPlnData,
  });
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
    if (!detailData?.data[0]) return;

    const existing = detailData.data[0];
    const selected = getSelectedField(existing, type);

    reset({
      id: Number(id),
      id_petugas: id_petugas!,
      filename: selected?.file || null,
      latlong: selected?.latlong || "0",
      nilai: selected?.nilai ? Number(selected.nilai) : 0,
      waktu_catat: selected?.waktu || undefined,
      type: type,
    });

    if (selected?.file) {
      setPhotoUrl(selected.file);
    }
  }, [detailData, id, id_petugas, reset, type]);

  if (isLoading || isFetching) return <FormMeterSkeleton />;

  return (
    <div className="w-full p-4 overflow-hidden shadow-none bg-whiteCust rounded-xl">
      {loadingUploadedFile && <FullScreenSpinner />}
      {isPending && <FullScreenSpinner />}
      <BackButton to={`/list-data/detail-pln/${kode_trans}?jam=${jam}`} />
      <TimeInfo />
      <Total total={total} selesai={selesai} title="Stand Meter PLN" />
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
            Meter {type?.toUpperCase()}
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
                Nilai Sebelumnya
              </label>
              <input
                readOnly
                defaultValue={NilaiAwal?.nilai_awal}
                inputMode="numeric"
                className={`w-full px-3 py-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-300 rounded-md cursor-not-allowed`}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Stand Akhir
              </label>
              <input
                type="number"
                step={"any"}
                {...register("nilai")}
                placeholder="Input Stand Akhir Meter"
                // onChange={(e) => {
                // const nilaiAwal = NilaiAwal?.nilai_awal || 0;
                // const nilaiAkhir = Number(e.target.value);
                // setAkumulasi(nilaiAkhir - nilaiAwal);
                // setShowAlertNegative(nilaiAkhir < nilaiAwal);
                // setValue("nilai", Number(e.target.value));
                // }}
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border ${
                  errors.nilai
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />

              {errors.nilai && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.nilai.message}
                </p>
              )}
            </div>
            {/* {showAlertNegative && (
              <p className="px-2 py-1 mt-4 text-xs text-yellow-600 bg-yellow-100 rounded">
                ⚠️ Stand akhir lebih kecil dari nilai stand sebelumnya!
              </p>
            )} */}
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
                  {/* {(akumulasi ?? 0) < 0 && (
                    <p className="px-3 py-2 mt-2 text-sm text-center text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-md">
                      ⚠️ Nilai stand akhir lebih kecil dari nilai stand
                      sebelumnya!
                    </p>
                  )} */}
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
                              to: `/list-data/detail-pln/${kode_trans}?jam=${jam}`,
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
