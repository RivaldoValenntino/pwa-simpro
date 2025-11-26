import { createFileRoute, useNavigate } from "@tanstack/react-router";
// import TimeInfo from "../../../components/time-info";
import Dropdown, { type Option } from "../../../components/dropdown";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { listRefAnomaliQuery } from "../../../queries/fetch-ref-anomali";
import { uploadFileQuery } from "../../../queries/upload-file/upload-file";
import toast from "react-hot-toast";
import FullScreenSpinner from "../../../components/full-screen-spinner";
import { CameraIcon } from "lucide-react";
import {
  InsertAnomaliSchema,
  type InsertAnomaliRequest,
} from "../../../types/requests/trans-anomali/insert-anomali";
import { useAuthStore } from "../../../store/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTransAnomali } from "../../../queries/anomali/insert-anomali";
import imageCompression from "browser-image-compression";
import { useServerTime } from "../../../hooks/useServerTime";
import { queryClient } from "../../../main";
import BackButton from "../../../components/back-button";
import CameraWithZoom from "../../../components/camera-with-zoom";
export const Route = createFileRoute("/__authenticated/form/anomali")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedResiko, setSelectedResiko] = useState<Option | undefined>();
  const [selectedAnomali, setSelectedAnomali] = useState<Option | undefined>();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [showCamera, setShowCamera] = useState(false);
  const [loadingUploadedFile, setLoadingUploadedFile] = useState(false);
  const navigate = useNavigate();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cachedFormData, setCachedFormData] =
    useState<InsertAnomaliRequest | null>(null);

  const resikoOptions: Option[] = [
    { value: "kecil", label: "Kecil" },
    { value: "sedang", label: "Sedang" },
    { value: "tinggi", label: "Tinggi" },
  ];

  const { data: RefAnomaliList } = useQuery(listRefAnomaliQuery());

  const anomaliOptions: Option[] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    RefAnomaliList?.data?.map((item: any) => ({
      value: item.id,
      label: item.nama,
    })) || [];
  const serverTime = useServerTime();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<InsertAnomaliRequest>({
    resolver: zodResolver(InsertAnomaliSchema),
    defaultValues: {
      id_petugas: Number(useAuthStore.getState().user?.id),
      id_installasi: Number(useAuthStore.getState().user?.id_installasi),
      tanggal: "", // fallback ke string kosong
      waktu: "",
      foto: null,
      resiko: "",
      id_jenis_anomali: undefined,
      keterangan: "",
      dampak: "",
    },
  });

  const handleTakePhoto = async () => {
    setShowCamera(true);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: insertTransAnomali,
  });

  const onSubmit = async (data: InsertAnomaliRequest) => {
    if (data.id_jenis_anomali === undefined) {
      toast.error("Jenis Anomali harus dipilih");
      return;
    }

    if (data.resiko === "") {
      toast.error("Resiko Anomali harus dipilih");
      return;
    }

    if (!photoFile) {
      toast.error("Foto kondisi anomali harus diambil");
      return;
    }

    try {
      setLoadingUploadedFile(true);
      const secretKey = import.meta.env.VITE_API_SECRET_KEY;

      // Upload file ke API
      const uploadResult = await uploadFileQuery(
        photoFile,
        `foto_anomali-${Date.now()}`,
        "simpro/trans/foto_anomali",
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
  };

  useEffect(() => {
    if (serverTime) {
      const pad = (n: number) => n.toString().padStart(2, "0");

      const formatted =
        `${serverTime.getFullYear()}-${pad(serverTime.getMonth() + 1)}-${pad(serverTime.getDate())} ` +
        `${pad(serverTime.getHours())}:${pad(serverTime.getMinutes())}:${pad(serverTime.getSeconds())}`;
      setValue("tanggal", formatted, { shouldValidate: true });
      setValue("waktu", formatted, { shouldValidate: true });
    }
  }, [serverTime, setValue]);

  useEffect(() => {
    if (selectedResiko?.value) {
      setValue("resiko", selectedResiko.value, { shouldValidate: true });
    }
  }, [selectedResiko, setValue]);

  useEffect(() => {
    if (selectedAnomali?.value) {
      setValue("id_jenis_anomali", Number(selectedAnomali.value), {
        shouldValidate: true,
      });
    }
  }, [selectedAnomali, setValue]);
  return (
    <div className="w-full p-4 bg-whiteCust rounded-xl">
      {loadingUploadedFile && <FullScreenSpinner />}
      {isPending && <FullScreenSpinner />}
      <BackButton to={`/anomali`} />
      {/* <TimeInfo /> */}
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 bg-white rounded-xl"
      >
        <Dropdown
          isError={!!errors.resiko}
          label="Resiko Anomali"
          options={resikoOptions}
          selected={selectedResiko}
          onChange={(option) => setSelectedResiko(option)}
        />
        {errors.resiko && (
          <p className="text-xs text-red-500 ">{errors.resiko.message}</p>
        )}
        <Dropdown
          isError={!!errors.id_jenis_anomali}
          label="Jenis Anomali"
          options={anomaliOptions}
          selected={selectedAnomali}
          onChange={(option) => setSelectedAnomali(option)}
        />
        {errors.id_jenis_anomali && (
          <p className="text-xs text-red-500">
            {errors.id_jenis_anomali.message}
          </p>
        )}

        <div className="mt-2">
          <label className="block mb-1 text-sm font-semibold text-gray-800 capitalize">
            Keterangan
          </label>
          <textarea
            rows={5}
            placeholder="Masukkan keterangan anomali"
            {...register("keterangan")}
            className={`w-full px-3 py-2 text-sm text-gray-700 bg-white border ${
              errors.keterangan
                ? "ring-1 ring-red-500"
                : "border-gray-300 focus:ring-1 focus:ring-primary"
            } rounded-lg outline-none`}
          ></textarea>

          {errors.keterangan && (
            <p className="text-xs text-red-500 ">{errors.keterangan.message}</p>
          )}
        </div>

        <div className="mt-2">
          <label className="block mb-1 text-sm font-semibold text-gray-800 capitalize">
            Dampak
          </label>
          <textarea
            rows={5}
            placeholder="Masukkan dampak anomali"
            {...register("dampak")}
            className={`w-full px-3 py-2 text-sm text-gray-700 bg-white border ${
              errors.dampak
                ? "ring-1 ring-red-500"
                : "border-gray-300 focus:ring-1 focus:ring-primary"
            } rounded-lg outline-none`}
          ></textarea>

          {errors.dampak && (
            <p className="text-xs text-red-500 ">{errors.dampak.message}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleTakePhoto}
          className="flex items-center justify-center w-full py-2 mt-4 space-x-2 text-sm font-medium text-center text-blue-600 bg-blue-100 rounded-t-lg"
        >
          <CameraIcon className="w-5 h-5 mb-0.5" />
          <span className="text-center">Foto Kondisi Anomali</span>
        </button>

        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Foto Kondisi Anomali"
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
      </form>
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
                      // setTimeout(() => {
                      navigate({
                        to: `/anomali`,
                      });
                      queryClient.invalidateQueries({
                        queryKey: [
                          "fetchLastActivity",
                          useAuthStore.getState().user?.id,
                        ],
                      });
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
    </div>
  );
}
