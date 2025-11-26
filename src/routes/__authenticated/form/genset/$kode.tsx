import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import {
  InsertGensetSchema,
  type InsertGensetRequest,
} from "../../../../types/requests/trans-genset/insert-genset";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../../../store/auth";
import { insertGensetData } from "../../../../queries/trans-genset/insert-genset";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../../../../main";
import TimeInfo from "../../../../components/time-info";
import FullScreenSpinner from "../../../../components/full-screen-spinner";
import BackButton from "../../../../components/back-button";
import Dropdown, { type Option } from "../../../../components/dropdown";
import { CameraIcon } from "lucide-react";
import CameraWithZoom from "../../../../components/camera-with-zoom";
import imageCompression from "browser-image-compression";
import { uploadFileQuery } from "../../../../queries/upload-file/upload-file";
export const Route = createFileRoute("/__authenticated/form/genset/$kode")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const [loadingUploadedFile, setLoadingUploadedFile] = useState(false);
  const [cachedFormData, setCachedFormData] =
    useState<InsertGensetRequest | null>(null);
  const { kode } = useParams({ strict: false });
  const { jam } = useSearch({ strict: false });
  const navigate = useNavigate();
  if (!jam) navigate({ to: "/not-found" });
  const [selectedJenis, setSelectedJenis] = useState<Option | null>(null);
  const jenisOptions = [
    { label: "Pemanasan", value: "pemanasan" },
    { label: "Pemakaian", value: "pemakaian" },
  ];
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<InsertGensetRequest>({
    resolver: zodResolver(InsertGensetSchema),
    defaultValues: {
      id_petugas: Number(useAuthStore.getState().user?.id),
      id_installasi: Number(useAuthStore.getState().user?.id_installasi),
      tanggal: new Date().toISOString().split("T")[0],
      ampere: 0,
      voltase: 0,
      solar: 0,
      durasi: 0,
      jenis: selectedJenis?.value || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: insertGensetData,
  });

  const handleTakePhoto = async () => {
    setShowCamera(true);
  };

  const onSubmit = async (data: InsertGensetRequest) => {
    try {
      if (photoFile) {
        setLoadingUploadedFile(true);

        const secretKey = import.meta.env.VITE_API_SECRET_KEY;
        // const extension = photoFile.name.split(".").pop() || "jpg";
        const filename = `GNST_${selectedJenis?.value}-${Date.now()}`;

        // Upload file ke API
        const uploadResult = await uploadFileQuery(
          photoFile,
          filename,
          "simpro/trans/foto_mtr_kantor",
          secretKey
        );

        // Set URL ke form data
        data.filename = uploadResult.url;
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
  return (
    <div className="w-full p-4 bg-whiteCust rounded-xl">
      {isPending && <FullScreenSpinner />}
      {loadingUploadedFile && <FullScreenSpinner />}
      <BackButton to={`/list-data/detail-gnst/${kode}?jam=${jam}`} />
      <TimeInfo />

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

      <form
        className="p-4 bg-white rounded-lg shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Dropdown pilih jenis */}
        <Dropdown
          label="Jenis Pencatatan"
          options={jenisOptions}
          selected={selectedJenis || undefined}
          onChange={(option) => {
            setSelectedJenis(option);
            setValue("jenis", option.value);
          }}
          isError={false}
        />

        {selectedJenis?.value && (
          <>
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
          </>
        )}
        {selectedJenis?.value === "pemanasan" && (
          <>
            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium">Solar</label>
              <input
                type="number"
                step={"any"}
                {...register("solar", { valueAsNumber: true })}
                placeholder="Input nilai Solar"
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border  ${
                  errors.solar
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />
              {errors.solar && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.solar.message}
                </p>
              )}
            </div>
            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium">Durasi</label>
              <input
                type="number"
                step={"any"}
                {...register("durasi", { valueAsNumber: true })}
                placeholder="Input nilai Durasi"
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border  ${
                  errors.durasi
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />
              {errors.durasi && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.durasi.message}
                </p>
              )}
            </div>
          </>
        )}

        {/* Pemakaian: ampere, voltase, durasi, solar */}
        {selectedJenis?.value === "pemakaian" && (
          <>
            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium">Ampere</label>
              <input
                type="number"
                step={"any"}
                {...register("ampere", { valueAsNumber: true })}
                placeholder="Input nilai Ampere"
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border  ${
                  errors.ampere
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />
              {errors.ampere && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.ampere.message}
                </p>
              )}
            </div>

            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium">Voltase</label>
              <input
                type="number"
                step={"any"}
                {...register("voltase", { valueAsNumber: true })}
                placeholder="Input nilai Voltase"
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border  ${
                  errors.voltase
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />
              {errors.voltase && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.voltase.message}
                </p>
              )}
            </div>

            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium">Durasi</label>
              <input
                type="number"
                step={"any"}
                {...register("durasi", { valueAsNumber: true })}
                placeholder="Input nilai Durasi"
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border  ${
                  errors.durasi
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />
              {errors.durasi && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.durasi.message}
                </p>
              )}
            </div>

            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium">Solar</label>
              <input
                type="number"
                step={"any"}
                {...register("solar", { valueAsNumber: true })}
                placeholder="Input nilai Solar"
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border  ${
                  errors.solar
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              />
              {errors.solar && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.solar.message}
                </p>
              )}
            </div>
          </>
        )}

        {selectedJenis && (
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-sm font-semibold text-white transition rounded-lg bg-primary hover:bg-primary/80"
            disabled={isPending}
          >
            {isPending ? "Menyimpan..." : "Simpan"}
          </button>
        )}
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
                      // queryClient.invalidateQueries({
                      //   queryKey: ["DetailReservoarQuery", Number(id), kode],
                      // });
                      queryClient.invalidateQueries({
                        queryKey: [
                          "fetchLastActivity",
                          useAuthStore.getState().user?.id,
                        ],
                      });
                      navigate({
                        to: `/pages/detail-gnst/${kode}`,
                        search: {
                          jam: Number(jam),
                        },
                      });
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
