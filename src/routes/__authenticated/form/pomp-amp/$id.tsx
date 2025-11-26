/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import TimeInfo from "../../../../components/time-info";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DetailPompAmpQuery } from "../../../../queries/pomp-amp/detail-pomp-amp";
import { FormPompaSkeleton } from "../../../../components/skeleton/pompa-amp-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  InsertPompAmpSchema,
  type InsertPompAmpRequest,
} from "../../../../types/requests/pomp-amp/insert-pomp-amp";
import { uploadFileQuery } from "../../../../queries/upload-file/upload-file";
import toast from "react-hot-toast";
import FullScreenSpinner from "../../../../components/full-screen-spinner";
import { CameraIcon } from "@heroicons/react/24/outline";
import { insertPompAmp } from "../../../../queries/pomp-amp/insert-pomp-amp";
import { useAuthStore } from "../../../../store/auth";
import { queryClient } from "../../../../main";
import imageCompression from "browser-image-compression";
import { useServerTime } from "../../../../providers/server-time-provider";
import BackButton from "../../../../components/back-button";
import CameraWithZoom from "../../../../components/camera-with-zoom";
export const Route = createFileRoute("/__authenticated/form/pomp-amp/$id")({
  component: RouteComponent,
  validateSearch: z.object({
    kode: z.string().optional(),
    id_pompa: z.number(),

    jam: z.number(),
    id_trans: z.number(),
    jml_pompa: z.number(),
    type: z.string().optional(),
  }),
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { id_pompa } = useSearch({ strict: false });
  const { kode, jam, type } = useSearch({ strict: false });
  const { jml_pompa } = useSearch({ strict: false });
  // const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File>(new File([], ""));
  const [showCamera, setShowCamera] = useState(false);
  const [loadingUploadedFile, setLoadingUploadedFile] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const id_petugas = useAuthStore.getState().user?.id;
  const navigate = useNavigate();
  if (!jam) navigate({ to: "/not-found" });
  const time = useServerTime();
  const [pompaList, setPompaList] = useState<
    {
      urutan: number;
      status_on: 0 | 1;
      nilai: number | null;
      filename: string | null;
    }[]
  >([]);

  const [pompaPhotos, setPompaPhotos] = useState<(string | null)[]>(
    Array.from({ length: Number(jml_pompa) }, () => null)
  );
  const [pompaFiles, setPompaFiles] = useState<(File | null)[]>(
    Array.from({ length: Number(jml_pompa) }, () => null)
  );

  const [currentPompaIndex, setCurrentPompaIndex] = useState<number | null>(
    null
  );

  const {
    data: DetailData,
    isLoading,
    isFetching,
  } = useQuery(DetailPompAmpQuery(Number(id), kode));
  // Setup pompaList awal dari jml_pompa

  const form = useForm<InsertPompAmpRequest>({
    resolver: zodResolver(InsertPompAmpSchema),
    defaultValues: {
      id: Number(id),
      id_petugas: id_petugas || 0,
      hz: 0,
      filename: null,
      latlong: "0",
      waktu_catat: new Date().toISOString(),
      pompa_list: [],
    },
  });

  useEffect(() => {
    const jumlahPompa = Number(jml_pompa);
    const initPompaList = Array.from({ length: jumlahPompa }, (_, index) => ({
      urutan: index + 1,
      status_on: 0 as 0 | 1,
      nilai: null,
      filename: null,
    }));
    setPompaList(initPompaList);
  }, [jml_pompa]);

  useEffect(() => {
    form.setValue("pompa_list", pompaList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pompaList, form.setValue]);

  const handleToggle = (index: number) => {
    setPompaList((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              status_on: item.status_on === 1 ? 0 : 1,
              nilai: item.status_on === 1 ? 0 : item.nilai, // kalau OFF → reset nilai
            }
          : item
      )
    );
  };

  const handleChangeNilai = (index: number, value: number | null) => {
    setPompaList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, nilai: value } : item))
    );
  };

  const insertMutation = useMutation({
    mutationFn: insertPompAmp,
    onSuccess: () => {
      toast.success("Data berhasil disimpan");
      // setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: ["DetailPompAmpQuery", Number(id), kode],
      });
      queryClient.invalidateQueries({
        queryKey: ["fetchLastActivity", id_petugas],
      });
      navigate({
        to: `/pages/detail-pomp-amp/${kode}`,
        search: {
          jam: Number(jam),
          type: type,
        },
      });

      // }, 2000);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      console.error("Insert failed", err);
      toast.error("Gagal menyimpan data");
    },
  });

  const geolocation = async () => {
    const loadingToast = toast.loading("Mengambil lokasi...");

    await new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const latlong = `${latitude},${longitude}`;

          form.setValue("latlong", latlong, { shouldValidate: true });

          toast.dismiss(loadingToast);
          toast.success("Lokasi berhasil didapat");
          resolve();
        },
        (error) => {
          console.error("Gagal mendapatkan lokasi:", error);

          toast.dismiss(loadingToast);
          toast.error("Gagal mendapatkan lokasi");
          resolve();
        }
      );
    });
  };

  useEffect(() => {
    if (time) {
      const pad = (n: number) => n.toString().padStart(2, "0");

      const formatted =
        `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())} ` +
        `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

      form.setValue("waktu_catat", formatted, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, form.setValue]);

  useEffect(() => {
    const jumlahPompa = Number(jml_pompa);

    if (jumlahPompa > 0) {
      const initPompaList = Array.from({ length: jumlahPompa }, (_, index) => ({
        urutan: index + 1,
        status_on: 0 as 0 | 1,
        nilai: 0,
        filename: null,
      }));

      if (DetailData?.child && DetailData.child.length > 0) {
        const newPompaPhotos = [...pompaPhotos];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        DetailData.child.forEach((item: any) => {
          const idx = Number(item.urutan) - 1;
          if (initPompaList[idx]) {
            initPompaList[idx] = {
              urutan: Number(item.urutan),
              status_on: Number(item.status_on) as 0 | 1,
              nilai: item.nilai ? Number(item.nilai) : 0,
              filename: item.filename ?? null,
            };

            // 🔥 isi juga photoUrl biar nongol di UI
            if (item.filename) {
              newPompaPhotos[idx] = item.filename;
            }
          }
        });

        setPompaList(initPompaList);
        setPompaPhotos(newPompaPhotos); // <---- ini penting
        form.setValue("pompa_list", initPompaList);
      }

      form.reset({
        id: Number(DetailData?.data.id),
        id_petugas: id_petugas!,
        hz: Number(DetailData?.data.hz),
        filename: DetailData?.data.file,
        latlong: DetailData?.data.latlong ?? "",
        waktu_catat: DetailData?.data.waktu_catat ?? "",
      });
      // if (DetailData?.data.file !== null || DetailData?.data.file !== "") {
      //   setPhotoUrl(DetailData?.data.file ?? "");
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DetailData, form, jml_pompa, id_petugas]);

  // const handleTakePhotoSingle = () => {
  //   setShowCamera(true);
  //   setCurrentPompaIndex(null); // bedain antara foto global vs foto per-pompa
  // };

  if (isFetching || isLoading) return <FormPompaSkeleton />;
  return (
    <div className="w-full p-4 shadow bg-whiteCust rounded-xl">
      {(loadingUploadedFile || insertMutation.isPending) && (
        <FullScreenSpinner />
      )}

      <BackButton
        to={`/pages/detail-pomp-amp/${kode}`}
        search={{
          jam: jam,
          ...(type && type !== "undefined" ? { type } : {}),
        }}
      />
      <TimeInfo />
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 w-dvw h-dvh">
          <div className="relative z-50 mx-auto bg-black rounded-lg ">
            <CameraWithZoom
              onCapture={async (file, dataUrl) => {
                if (currentPompaIndex === null) {
                  // 🔥 Foto global (AMP)
                  // setPhotoUrl(dataUrl);
                  setPhotoFile(file);

                  // langsung masukin ke form
                  form.setValue("filename", dataUrl); // sementara base64
                  // nanti waktu "Proses", file ini akan diupload dan url aslinya replace
                } else {
                  // Foto per-pompa
                  setPompaPhotos((prev) =>
                    prev.map((photo, i) =>
                      i === currentPompaIndex ? dataUrl : photo
                    )
                  );
                  setPompaFiles((prev) =>
                    prev.map((f, i) => (i === currentPompaIndex ? file : f))
                  );
                }

                setShowCamera(false);
              }}
              onClose={() => setShowCamera(false)}
            />
          </div>
        </div>
      )}
      <div className="p-4 mb-4 bg-white rounded-md shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-center">
          {DetailData?.data?.nama_pompa}
        </h3>

        {/* <button
          type="button"
          onClick={handleTakePhotoSingle}
          className="flex items-center justify-center w-full py-2 space-x-2 text-sm font-medium text-center text-blue-600 bg-blue-100 rounded-lg"
        >
          <CameraIcon className="w-5 h-5 mb-0.5" />
          <span className="text-center">Foto Pompa Ampere</span>
        </button>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="POMP AMP"
            className="object-cover w-full mt-4 rounded-md h-96"
          />
        ) : (
          <div className="flex items-center justify-center w-full mt-4 text-sm text-gray-400 bg-gray-200 rounded-md h-36">
            Belum ada foto
          </div>
        )} */}

        <label className="block my-2 text-sm font-medium">Jumlah Pompa</label>
        <input
          type="text"
          value={jml_pompa}
          className="w-full px-3 py-2 mb-4 text-sm text-gray-400 bg-gray-300 rounded"
          placeholder="Input Jumlah pompa"
          disabled
        />

        <button
          type="button"
          onClick={async () => {
            await geolocation();
            const secretKey = import.meta.env.VITE_API_SECRET_KEY;

            // Ambil nilai form sekarang
            const values = form.getValues();

            // Upload foto per-pompa kalau ada
            const uploadedPompaList = await Promise.all(
              values.pompa_list.map(async (pompa, i) => {
                if (pompa.status_on === 1) {
                  // Jika ada file baru
                  if (pompaFiles[i] && pompaFiles[i]!.size > 0) {
                    setLoadingUploadedFile(true);

                    // 🔹 kompres dulu
                    const compressedFile = await imageCompression(
                      pompaFiles[i]!,
                      {
                        maxSizeMB: 0.2,
                        maxWidthOrHeight: 1024,
                        useWebWorker: true,
                      }
                    );

                    const uploadResult = await uploadFileQuery(
                      compressedFile,
                      `POMP_${id_pompa}_${pompa.urutan}_${Date.now()}`,
                      "simpro/trans/foto_pomp_amp",
                      secretKey
                    );

                    setLoadingUploadedFile(false);
                    return {
                      ...pompa,
                      filename: uploadResult.url,
                    };
                  }

                  // Kalau ga ada file baru, tapi lagi edit → pakai file lama dari DetailData
                  if (DetailData?.child?.[i]?.filename) {
                    return {
                      ...pompa,
                      filename: DetailData.child[i].filename,
                    };
                  }

                  // Kalau bener-bener ga ada (baru input & ga upload foto)
                  return { ...pompa, filename: null };
                }

                // Kalau pompa OFF, skip file (biarin null aja)
                return { ...pompa, filename: null };
              })
            );

            // Upload global foto AMP kalau perlu (kaya sekarang)
            if (photoFile && photoFile.size > 0) {
              setLoadingUploadedFile(true);

              const compressedFile = await imageCompression(photoFile, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1280,
                useWebWorker: true,
              });

              const uploadResult = await uploadFileQuery(
                compressedFile,
                `POMP_AMP_${id_pompa}-${Date.now()}`,
                "simpro/trans/foto_pomp_amp",
                secretKey
              );

              setLoadingUploadedFile(false);
              toast.success("Foto berhasil diunggah");
              form.setValue("filename", uploadResult.url);
            } else if (DetailData?.data?.file) {
              form.setValue("filename", DetailData.data.file);
            } else {
              form.setValue("filename", null);
            }

            // Inject hasil upload ke form sebelum confirm
            form.setValue("pompa_list", uploadedPompaList);

            setShowConfirmModal(true);
          }}
          className={`w-full py-2 mb-4 text-sm font-semibold text-white rounded ${
            insertMutation.isPending
              ? "bg-blue-400 cursor-not-allowed opacity-50"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={insertMutation.isPending}
        >
          {insertMutation.isPending ? "Menyimpan..." : "Proses"}
        </button>

        {pompaList.map((pompa, index) => {
          // cari spek_pompa yang sesuai urutan ke
          const spek = DetailData?.spek_pompa?.find(
            (s: any) => Number(s.urutan_ke) === pompa.urutan
          );

          return (
            <div key={index} className="p-3 mb-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => handleToggle(index)}
                  className={`w-14 h-6 rounded-full transition-colors flex items-center px-1 ${
                    pompa.status_on ? "bg-green-200" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transform transition-transform ${
                      pompa.status_on
                        ? "translate-x-8 bg-green-500"
                        : "translate-x-0 bg-red-500"
                    }`}
                  />
                </button>
                <span className="text-sm font-medium">
                  Pompa {pompa.urutan} ({spek ? `${spek.keterangan}` : "-"})
                </span>
              </div>

              {/* Input Nilai */}
              <input
                type="number"
                step={"any"}
                value={pompa.nilai || ""}
                disabled={!pompa.status_on}
                onChange={(e) =>
                  handleChangeNilai(index, Number(e.target.value))
                }
                className="w-full px-2 py-1 mb-2 text-sm border rounded"
                placeholder="Nilai Ampere"
              />

              {/* Foto per Pompa */}
              {pompa.status_on && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      setCurrentPompaIndex(index);
                      setShowCamera(true);
                    }}
                    className="flex items-center justify-center w-full py-1 text-sm text-blue-600 bg-blue-100 rounded"
                  >
                    <CameraIcon className="w-4 h-4 mr-1" /> Foto Pompa{" "}
                    {pompa.urutan}
                  </button>

                  {pompaPhotos[index] ? (
                    <img
                      src={pompaPhotos[index] as string}
                      alt={`Pompa ${pompa.urutan}`}
                      className="object-cover w-full mt-2 rounded h-72"
                    />
                  ) : (
                    <p className="mt-1 text-xs text-gray-400">Belum ada foto</p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <label className="block mt-4 mb-1 text-sm font-medium">Hz</label>
        <input
          type="number"
          {...form.register("hz")}
          placeholder="Input Hz pompa"
          className="w-full px-3 py-2 text-sm rounded bg-grayCust"
        />
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="p-6 bg-white shadow-lg rounded-xl w-80">
              <h2 className="mb-4 text-lg font-semibold text-center">
                Konfirmasi
              </h2>
              <p className="mb-6 text-sm text-center text-gray-600">
                Apakah Anda yakin ingin menyimpan data ini?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    form.handleSubmit((data) => {
                      // const filteredPompaList = data.pompa_list.filter(
                      //   (pompa) => pompa.status_on === 1
                      // );

                      // insertMutation.mutate({
                      //   ...data,
                      //   pompa_list: filteredPompaList,
                      // });
                      insertMutation.mutate(data);
                    })();
                  }}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Ya, Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
