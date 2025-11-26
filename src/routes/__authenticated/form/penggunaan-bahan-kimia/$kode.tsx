import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import TimeInfo from "../../../../components/time-info";
import {
  InsertBahanKimiaSchema,
  type InsertBahanKimiaRequest,
} from "../../../../types/requests/bahan-kimia/insert-bahan-kimia";
import { useAuthStore } from "../../../../store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { insertPenggunaanBahanKimia } from "../../../../queries/bahan-kimia/insert-bahan-kimia";
import { useMutation } from "@tanstack/react-query";
import FullScreenSpinner from "../../../../components/full-screen-spinner";
import { queryClient } from "../../../../main";
import BackButton from "../../../../components/back-button";

export const Route = createFileRoute(
  "/__authenticated/form/penggunaan-bahan-kimia/$kode"
)({
  component: RouteComponent,
});

function RouteComponent() {
  let { kode } = useParams({ strict: false });
  const id_petugas = useAuthStore.getState().user?.id;
  const id_installasi = useAuthStore.getState().user?.id_installasi;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cachedFormData, setCachedFormData] =
    useState<InsertBahanKimiaRequest | null>(null);
  const navigate = useNavigate();

  if (kode === "soda_ash") {
    kode = "Soda ash";
  }
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<InsertBahanKimiaRequest>({
    resolver: zodResolver(InsertBahanKimiaSchema),
    defaultValues: {
      id_installasi: Number(id_installasi),
      jenis: kode,
      tanggal: new Date().toISOString().split("T")[0],
      id_petugas: id_petugas!,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: insertPenggunaanBahanKimia,
  });

  const onSubmit = (data: InsertBahanKimiaRequest) => {
    setCachedFormData(data);
    setShowConfirmModal(true);
  };
  return (
    <>
      <div className="w-full p-4 rounded-xl bg-whiteCust h-dvh">
        <BackButton to={`/bahan-kimia`} />
        <TimeInfo />
        {isPending && <FullScreenSpinner />}
        <div className="flex flex-col justify-center items-center w-full p-4 rounded-xl bg-white mt-4">
          <h1 className="text-black font-bold capitalize">
            {kode?.replace("_", " ")}
          </h1>

          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-2 ">
              <label className="block mb-1 text-sm font-medium capitalize">
                Pemakaian {kode?.replace("_", " ")}
              </label>
              <input
                type="number"
                step={"any"}
                {...register("nilai", { valueAsNumber: true })}
                placeholder="Nilai Pemakaian"
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

            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium capitalize">
                Keterangan
              </label>
              <textarea
                rows={5}
                placeholder="Keterangan"
                {...register("keterangan")}
                className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border ${
                  errors.keterangan
                    ? "ring-1 ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-primary"
                } rounded-lg outline-none`}
              ></textarea>

              {errors.keterangan && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.keterangan.message}
                </p>
              )}
              {/* {errors.level_air && (
              <p className="mt-1 text-xs text-red-500">
                {errors.level_air.message}
              </p>
            )} */}
            </div>
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
                            to: `/bahan-kimia`,
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
      </div>
    </>
  );
}
