import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerTime } from "../../../../hooks/useServerTime";
import {
  InsertCipoletySchema,
  type InsertCipoletyRequests,
} from "../../../../types/requests/cipolety/insert-cplt";
import { useAuthStore } from "../../../../store/auth";
import { listCipoletyQuery } from "../../../../queries/cipolety/list-cplt";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertCipoletyData } from "../../../../queries/cipolety/insert-cplt";
import { uploadFileQuery } from "../../../../queries/upload-file/upload-file";
import toast from "react-hot-toast";
import FullScreenSpinner from "../../../../components/full-screen-spinner";
import FormMeterSkeleton from "../../../../components/skeleton/meter/form-meter-skeleton";
import TimeInfo from "../../../../components/time-info";
import Total from "../../../../components/ui/total";
import { queryClient } from "../../../../main";
import CipoletyForm from "../../../../components/CIPOLETY/cipolety-form";
import { DetailCipoletyQuery } from "../../../../queries/cipolety/detail-cplt";
// import { DetailCipoletyQuery } from "../../../../queries/cipolety/detail-cplt";
import imageCompression from "browser-image-compression";
import BackButton from "../../../../components/back-button";
import CameraWithZoom from "../../../../components/camera-with-zoom";
export const Route = createFileRoute("/__authenticated/form/cipolety/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { kode } = useSearch({ strict: false });
  const { id_wtp } = useSearch({ strict: false });
  const { jam } = useSearch({ strict: false });
  const id_petugas = useAuthStore.getState().user?.id;
  // const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoUrl1, setPhotoUrl1] = useState<string | null>(null);
  const [photoUrl2, setPhotoUrl2] = useState<string | null>(null);

  const [loadingUploadedFile, setLoadingUploadedFile] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [photoFiles, setPhotoFiles] = useState<{
    [key in "file_cipolety1" | "file_cipolety2"]?: File;
  }>({});

  const [setTinggiAwal, setSetTinggiAwal] = useState<number | null>(null);
  const [setTinggiAwal2, setSetTinggiAwal2] = useState<number | null>(null);
  const [setLdAwal, setSetLdAwal] = useState<number | null>(null);
  const [setLdAwal2, setSetLdAwal2] = useState<number | null>(null);
  const [cachedFormData, setCachedFormData] =
    useState<InsertCipoletyRequests | null>(null);

  const navigate = useNavigate();
  if (!jam) navigate({ to: "/not-found" });
  const time = useServerTime();
  const [showCamera, setShowCamera] = useState(false);
  const [currentPhotoField, setCurrentPhotoField] = useState<
    keyof InsertCipoletyRequests | null
  >(null);
  const [currentLatLongField, setCurrentLatLongField] = useState<
    keyof InsertCipoletyRequests | null
  >(null);
  // const [photoFile, setPhotoFile] = useState<File | null>(null);

  const openCamera = (
    valueName: keyof InsertCipoletyRequests,
    latlongArgs: keyof InsertCipoletyRequests
  ) => {
    setCurrentPhotoField(valueName);
    setCurrentLatLongField(latlongArgs);
    setShowCamera(true);
  };

  // Gunakan ini di button/onTakePhoto
  // onTakePhoto={() => openCamera("file_cipolety1", "latlong_cipolety1")}

  // const ketinggianAwal = Number(detailData?.nilai_awal || 0);

  const id_installasi = useAuthStore.getState().user?.id_installasi;
  const dateServer = time?.toISOString().split("T")[0];
  const {
    data: AllData,
    isLoading: isLoadingAll,
    isFetching: isFetchingAll,
  } = useQuery(
    listCipoletyQuery(dateServer, kode, Number(id_installasi), Number(14))
  );

  const { data: detailData } = useQuery(DetailCipoletyQuery(Number(id), kode));
  const totalData = AllData?.data.length;
  const selesaiData = AllData?.data.filter(
    (item) =>
      item.waktu_catat_cipolety1 !== null && item.waktu_catat_cipolety2 !== null
  ).length;

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InsertCipoletyRequests>({
    resolver: zodResolver(InsertCipoletySchema),
    defaultValues: {
      id: Number(id),
      id_petugas: id_petugas!,
      file_cipolety1: null,
      file_cipolety2: null,
      latlong_cipolety1: "0",
      latlong_cipolety2: "0",
      waktu_catat_cipolety1: null,
      waktu_catat_cipolety2: null,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: InsertCipoletyData,
  });

  const onSubmit = async (
    data: InsertCipoletyRequests,
    formType: "cipolety1" | "cipolety2"
  ) => {
    const fieldName =
      formType === "cipolety1" ? "file_cipolety1" : "file_cipolety2";
    const file = photoFiles[fieldName];
    let uploadedUrl = data[fieldName]; // default ke data sebelumnya

    if (file) {
      setLoadingUploadedFile(true);
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });

        const secretKey = import.meta.env.VITE_API_SECRET_KEY;
        const uploadResult = await uploadFileQuery(
          compressedFile,
          `CPLT_${id_wtp}-${Date.now()}`,
          "simpro/trans/foto_cplt",
          secretKey
        );

        uploadedUrl = uploadResult.url; // simpan hasil upload
        toast.success("Foto berhasil diunggah");
      } catch (err) {
        console.error(err);
        toast.error("Gagal mengunggah foto : " + err);
        setLoadingUploadedFile(false);
        return;
      }
      setLoadingUploadedFile(false);
    }

    // Buat form data baru dengan URL hasil upload
    const newFormData = {
      ...data,
      [fieldName]: uploadedUrl,
    };

    setCachedFormData(newFormData);
    setShowConfirmModal(true);
  };

  useEffect(() => {
    if (detailData?.data?.[0]) {
      const item = detailData.data[0];
      reset({
        id: Number(item.id),
        id_petugas: id_petugas!,
        cipolety1_tinggi: Number(item.cipolety1_tinggi),
        cipolety1_ld: Number(item.cipolety1_ld),
        cipolety2_tinggi: Number(item.cipolety2_tinggi),
        cipolety2_ld: Number(item.cipolety2_ld),
        file_cipolety1: item.file_cipolety1 || null,
        file_cipolety2: item.file_cipolety2 || null,
        latlong_cipolety1: item.latlong_cipolety1 || "0",
        latlong_cipolety2: item.latlong_cipolety2 || "0",
        waktu_catat_cipolety1: item.waktu_catat_cipolety1 || null,
        waktu_catat_cipolety2: item.waktu_catat_cipolety2 || null,
      });

      // Set tinggi dan ld awal untuk preview
      setSetTinggiAwal(Number(item.cipolety1_tinggi));
      setSetLdAwal(Number(item.cipolety1_ld));
      setSetTinggiAwal2(Number(item.cipolety2_tinggi));
      setSetLdAwal2(Number(item.cipolety2_ld));

      // Set preview foto kalau ada
      setPhotoUrl1(item.file_cipolety1 || null);
      setPhotoUrl2(item.file_cipolety2 || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailData, reset]);

  if (isFetchingAll || isLoadingAll) return <FormMeterSkeleton />;
  return (
    <>
      <div className="w-full p-4 overflow-hidden shadow-none bg-whiteCust rounded-xl">
        {loadingUploadedFile && <FullScreenSpinner />}
        {isPending && <FullScreenSpinner />}
        <BackButton
          to={`/pages/detail-cplt/${kode}`}
          search={{
            jam: jam,
          }}
        />
        <TimeInfo />
        <Total total={totalData} selesai={selesaiData} title="Cipolety" />
        {showCamera && currentPhotoField && currentLatLongField && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 w-dvw h-dvh">
            <div className="relative z-50 mx-auto bg-black rounded-lg ">
              <CameraWithZoom
                onCapture={(file, dataUrl) => {
                  if (!currentPhotoField || !currentLatLongField) return;

                  // Preview gambar
                  if (currentPhotoField === "file_cipolety1")
                    setPhotoUrl1(dataUrl);
                  else if (currentPhotoField === "file_cipolety2")
                    setPhotoUrl2(dataUrl);

                  // Simpan File untuk nanti upload saat klik "Simpan"
                  setPhotoFiles((prev) => ({
                    ...prev,
                    [currentPhotoField]: file,
                  }));

                  // Ambil lokasi
                  navigator.geolocation.getCurrentPosition(
                    ({ coords }) => {
                      setValue(
                        currentLatLongField,
                        `${coords.latitude},${coords.longitude}`,
                        { shouldValidate: true }
                      );
                    },
                    (err) => console.error(err)
                  );

                  setShowCamera(false);
                }}
                onClose={() => setShowCamera(false)}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-center">
          <div className="w-full p-4 space-y-3 bg-white shadow-md rounded-2xl">
            <form
              onSubmit={handleSubmit((data) => onSubmit(data, "cipolety1"))}
            >
              <CipoletyForm
                title="Cipolety 1"
                tinggiKey="cipolety1_tinggi"
                ldKey="cipolety1_ld"
                tinggiAwal={setTinggiAwal || 0}
                ldAwal={setLdAwal || 0}
                photoUrl={photoUrl1}
                onTakePhoto={() =>
                  openCamera("file_cipolety1", "latlong_cipolety1")
                }
                errors={errors}
                setValue={setValue}
              />
              <button
                disabled={isPending}
                onClick={() => {
                  setValue("type", "cipolety1"); // set sebelum submit
                }}
                className="w-full px-3 py-2 mt-4 text-sm font-semibold text-white rounded-lg bg-primary"
                type="submit"
              >
                {isPending ? "Loading..." : "Simpan"}
              </button>
            </form>
          </div>
        </div>

        {/* Cipolety 2 */}
        <div className="flex items-center justify-center mt-4">
          <div className="w-full p-4 space-y-3 bg-white shadow-md rounded-2xl">
            <form
              onSubmit={handleSubmit((data) => onSubmit(data, "cipolety2"))}
            >
              <CipoletyForm
                title="Cipolety 2"
                tinggiKey="cipolety2_tinggi"
                ldKey="cipolety2_ld"
                tinggiAwal={setTinggiAwal2 || 0}
                ldAwal={setLdAwal2 || 0}
                photoUrl={photoUrl2}
                onTakePhoto={() =>
                  openCamera("file_cipolety2", "latlong_cipolety2")
                }
                errors={errors}
                setValue={setValue}
              />
              <button
                disabled={isPending}
                onClick={() => {
                  setValue("type", "cipolety2"); // set sebelum submit
                }}
                className="w-full px-3 py-2 mt-4 text-sm font-semibold text-white rounded-lg bg-primary"
                type="submit"
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
                                  "DetailCipoletyQuery",
                                  Number(id),
                                  kode,
                                ],
                              });
                              queryClient.invalidateQueries({
                                queryKey: ["fetchLastActivity", id_petugas],
                              });
                              navigate({
                                to: `/pages/detail-cplt/${kode}`,
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
    </>
  );
}
