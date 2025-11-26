import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import FullScreenSpinner from "../../../../components/full-screen-spinner";
import CameraWithZoom from "../../../../components/camera-with-zoom";
import BackButton from "../../../../components/back-button";
import TimeInfo from "../../../../components/time-info";
import { useState } from "react";
import { CameraIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../../store/auth";
import { listDataRefPompaQuery } from "../../../../queries/hours-pompa/list-ref-pompa";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Option } from "../../../../components/dropdown";
import Dropdown from "../../../../components/dropdown";
import {
  InsertHoursPompaSchema,
  type InsertHoursPompaRequest,
} from "../../../../types/requests/hours-pompa/insert-hours-pompa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient } from "../../../../main";
import { insertHoursMeterPompaData } from "../../../../queries/hours-pompa/insert-hours-meter";
import { uploadFileQuery } from "../../../../queries/upload-file/upload-file";

export const Route = createFileRoute("/__authenticated/form/hours-pompa/$kode")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { jam } = useSearch({ strict: false });
  const { kode } = useParams({ strict: false });

  const [showCamera, setShowCamera] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentPompaIndex, setCurrentPompaIndex] = useState<number | null>(
    null
  );

  const [loadingUploadedFile, setLoadingUploadedFile] = useState(false);
  const [jumlahPompa, setJumlahPompa] = useState<number | null>(null);
  const [selectedPompa, setSelectedPompa] = useState<Option | null>(null);

  // 👉 state lokal khusus preview foto
  const [localPompaList, setLocalPompaList] = useState<
    {
      urutan: number;
      nilai: number | null;
      filename: string | null;
      photoUrl: string | null;
      photoFile: File | null;
    }[]
  >([]);

  const navigate = useNavigate();
  if (!jam) navigate({ to: "/not-found" });
  const [cachedFormData, setCachedFormData] =
    useState<InsertHoursPompaRequest | null>(null);

  const { data: refPompaOptions } = useQuery(
    listDataRefPompaQuery(Number(useAuthStore.getState().user?.id_installasi))
  );

  const refPompaOptionsMap = refPompaOptions?.data.map((item) => ({
    label: item.nama_pompa,
    value: item.id,
  })) as Option[];

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InsertHoursPompaRequest>({
    resolver: zodResolver(InsertHoursPompaSchema),
    defaultValues: {
      id_installasi: Number(useAuthStore.getState().user?.id_installasi),
      id_petugas: Number(useAuthStore.getState().user?.id),
      id_pompa: 0,
      pompa_list: [],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: insertHoursMeterPompaData,
  });

  const onSubmit = async (data: InsertHoursPompaRequest) => {
    if (!localPompaList.length) {
      toast.error("Data pompa belum lengkap");
      return;
    }

    try {
      setLoadingUploadedFile(true);

      const secretKey = import.meta.env.VITE_API_SECRET_KEY;

      // Upload tiap file pompa
      const uploadedPompaList = await Promise.all(
        localPompaList.map(async (p) => {
          if (p.photoFile) {
            const filename = `POMPA_HRS_${p.urutan}_${Date.now()}`;

            try {
              const uploadResult = await uploadFileQuery(
                p.photoFile,
                filename,
                "simpro/trans/foto_pompa", // 📂 folder tujuan
                secretKey
              );

              return {
                urutan: p.urutan,
                nilai: p.nilai,
                filename: uploadResult.url, // simpan url dari API
              };
            } catch (err) {
              console.error("Upload gagal untuk pompa ke-", p.urutan, err);
              toast.error(`Upload gagal untuk pompa ke-${p.urutan}`);
              return {
                urutan: p.urutan,
                nilai: p.nilai,
                filename: null,
              };
            }
          } else {
            return {
              urutan: p.urutan,
              nilai: p.nilai,
              filename: null, // kalau ga ada file
            };
          }
        })
      );

      // Gabung ke form data
      const mergedData: InsertHoursPompaRequest = {
        ...data,
        pompa_list: uploadedPompaList,
      };

      setCachedFormData(mergedData);
      setShowConfirmModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memproses upload file");
    } finally {
      setLoadingUploadedFile(false);
    }
  };

  return (
    <div className="w-full p-4 bg-whiteCust rounded-xl">
      {isPending && <FullScreenSpinner />}

      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 w-dvw h-dvh">
          <div className="relative z-50 mx-auto bg-black rounded-lg ">
            <CameraWithZoom
              onCapture={async (file, dataUrl) => {
                if (currentPompaIndex !== null) {
                  const newList = [...localPompaList];
                  newList[currentPompaIndex] = {
                    ...newList[currentPompaIndex],
                    photoUrl: dataUrl,
                    photoFile: file,
                    filename: `POMPA-${currentPompaIndex + 1}-${Date.now()}`,
                  };
                  setLocalPompaList(newList);

                  // update ke form supaya tetap lolos validation
                  setValue(
                    "pompa_list",
                    newList.map((p) => ({
                      urutan: p.urutan,
                      nilai: p.nilai,
                      filename: p.filename,
                    })),
                    { shouldValidate: true }
                  );
                }
                setShowCamera(false);
              }}
              onClose={() => setShowCamera(false)}
            />
          </div>
        </div>
      )}
      {loadingUploadedFile && <FullScreenSpinner />}
      <BackButton
        to={`/pages/detail-mtr-hrs/${kode}`}
        search={{
          jam: jam,
        }}
      />
      <TimeInfo />

      <div className="flex items-center justify-center">
        <div className="w-full p-4 space-y-3 bg-white shadow-md rounded-2xl">
          <h2 className="text-sm font-bold text-center">
            Catat Hours Meter Pompa
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Dropdown
              isError={!!errors.id_pompa}
              label="Pompa"
              options={refPompaOptionsMap || []}
              selected={selectedPompa || undefined}
              onChange={(option) => {
                setSelectedPompa(option);
                setValue("id_pompa", Number(option?.value), {
                  shouldValidate: true,
                });

                const selected = refPompaOptions?.data.find(
                  (item) => item.id === option?.value
                );
                const jml = selected?.jml_pompa ?? null;
                setJumlahPompa(jml ? Number(jml) : null);

                if (jml) {
                  const newList = Array.from(
                    { length: Number(jml) },
                    (_, i) => ({
                      urutan: i + 1,
                      nilai: null,
                      filename: null,
                      photoUrl: null,
                      photoFile: null,
                    })
                  );
                  setLocalPompaList(newList);

                  setValue(
                    "pompa_list",
                    newList.map((p) => ({
                      urutan: p.urutan,
                      nilai: p.nilai,
                      filename: p.filename,
                    })),
                    { shouldValidate: true }
                  );
                }
              }}
            />

            {errors.id_pompa && (
              <p className="mt-1 text-xs text-red-500">
                {errors.id_pompa.message}
              </p>
            )}

            {jumlahPompa && (
              <div className="mt-4 space-y-4">
                <label className="block mb-2 text-sm font-medium">
                  Jumlah Pompa: {jumlahPompa}
                </label>

                {localPompaList.map((pompa, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-gray-50">
                    <h4 className="mb-2 text-sm font-semibold">
                      Pompa {pompa.urutan}
                    </h4>

                    {/* Input nilai */}
                    <input
                      type="number"
                      step="any"
                      value={pompa.nilai ?? ""}
                      onChange={(e) => {
                        const newList = [...localPompaList];
                        newList[index].nilai = Number(e.target.value);
                        setLocalPompaList(newList);

                        setValue(
                          "pompa_list",
                          newList.map((p) => ({
                            urutan: p.urutan,
                            nilai: p.nilai,
                            filename: p.filename,
                          })),
                          { shouldValidate: true }
                        );
                      }}
                      className="w-full px-2 py-1 mb-2 text-sm border rounded"
                      placeholder="Nilai"
                    />

                    {/* Foto */}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPompaIndex(index);
                        setShowCamera(true);
                      }}
                      className="flex items-center justify-center w-full py-1 text-sm text-blue-600 bg-blue-100 rounded-t"
                    >
                      <CameraIcon className="w-4 h-4 mr-1" /> Foto Pompa{" "}
                      {pompa.urutan}
                    </button>

                    {pompa.photoUrl ? (
                      <img
                        src={pompa.photoUrl}
                        alt={`Pompa ${pompa.urutan}`}
                        className="object-cover w-full h-56 rounded-b"
                      />
                    ) : (
                      <p className="mt-1 text-xs text-gray-400">
                        Belum ada foto
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2 mt-4 text-sm font-semibold text-white transition rounded-lg bg-primary hover:bg-primary/80"
            >
              Simpan
            </button>
          </form>

          {/* Modal konfirmasi */}
          {showConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="w-11/12 max-w-sm p-6 bg-white shadow-lg rounded-xl">
                <h3 className="mb-4 text-lg font-semibold text-center">
                  Konfirmasi Simpan Data
                </h3>

                <p className="text-sm text-center">
                  Apakah Anda yakin ingin menyimpan data ini?
                </p>

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
                              "fetchLastActivity",
                              Number(useAuthStore.getState().user?.id),
                            ],
                          });
                          navigate({
                            to: `/list-data/detail-mtr-hrs/${kode}?jam=${jam}`,
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
      </div>
    </div>
  );
}
