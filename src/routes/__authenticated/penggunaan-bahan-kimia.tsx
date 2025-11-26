import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { listDataPenggunaanBahanKimiaQuery } from "../../queries/list-data-penggunaan-bahan-kimia";
import { useAuthStore } from "../../store/auth";
import CardPenggunaanBahanKimia from "../../components/card-bahan-kimia";
import BackButton from "../../components/back-button";

export const Route = createFileRoute("/__authenticated/penggunaan-bahan-kimia")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { kode } = useSearch({ strict: false });
  const {
    data: ListData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    listDataPenggunaanBahanKimiaQuery(
      useAuthStore.getState().user?.id,
      new Date().toISOString().split("T")[0],
      kode
    )
  );

  const items = ListData?.data ?? [];

  return (
    <div className="w-full p-4 bg-whiteCust rounded-xl h-dvh">
      <BackButton to="/bahan-kimia" />

      {/* Skeleton saat loading */}
      {isLoading && (
        <div className="w-full max-w-md mx-auto space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-4 bg-white border border-gray-100 shadow-md rounded-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 rounded-full" />
                  <div className="w-24 h-4 bg-gray-200 rounded" />
                </div>
                <div className="w-20 h-3 bg-gray-200 rounded" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="w-32 h-3 bg-gray-200 rounded" />
                  <div className="w-40 h-3 bg-gray-100 rounded" />
                </div>
                <div className="w-16 h-5 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Jika tidak loading dan data kosong */}
      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 text-gray-500">
          <p className="mb-3">Tidak ada data penggunaan {kode}</p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className={`px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
              isFetching
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/80"
            }`}
          >
            {isFetching ? "Memuat..." : "Muat Ulang"}
          </button>
        </div>
      )}

      {/* Jika data ada */}
      {!isLoading && items.length > 0 && (
        <CardPenggunaanBahanKimia
          data={items.map((item) => ({
            jenis_bahan_kimia: item.jenis_bahan_kimia,
            nilai: item.nilai,
            keterangan: item.keterangan,
            waktu: item.created_dt,
            nama_petugas: item.nama_petugas,
            satuan: item.jenis_bahan_kimia === "Solar" ? "Lt" : "Kg",
          }))}
        />
      )}
    </div>
  );
}
