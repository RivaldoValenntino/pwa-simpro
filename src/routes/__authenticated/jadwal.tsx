import { createFileRoute } from "@tanstack/react-router";
import { ReminderCard } from "../../components/reminder-card";
import { useQuery } from "@tanstack/react-query";
import { listAlokasiJadwalReminderQuery } from "../../queries/fetch-alokasi-jadwal-reminder";
import { useAuthStore } from "../../store/auth";

export const Route = createFileRoute("/__authenticated/jadwal")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: ListData,
    isLoading,
    isFetching,
  } = useQuery(
    listAlokasiJadwalReminderQuery(
      Number(useAuthStore.getState().user?.id_installasi)
    )
  );
  if (isLoading || isFetching) {
    return (
      <div className="max-w-3xl p-4 mx-auto rounded-md shadow-none bg-whiteCust">
        <div className="p-4 bg-white rounded-xl">
          <div className="w-48 h-6 mb-4 bg-gray-300 rounded animate-pulse" />

          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-full px-3 py-4 mb-4 bg-gray-100 border border-gray-200 rounded-lg shadow-sm animate-pulse"
            >
              {/* Status badge */}
              <div className="flex items-center mb-2">
                <span className="w-24 h-5 bg-gray-300 rounded" />
              </div>

              {/* Title */}
              <div className="w-40 h-5 mb-3 bg-gray-300 rounded" />

              {/* Detail */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="w-24 h-4 bg-gray-300 rounded" />
                  <span className="w-20 h-4 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="w-20 h-4 bg-gray-300 rounded" />
                  <span className="w-12 h-4 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl p-4 mx-auto rounded-md shadow-none bg-whiteCust">
      <div className="p-4 bg-white rounded-xl">
        <h1 className="py-2 text-lg font-bold">Pengingat Alokasi Jadwal</h1>

        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full" />
            Belum dialokasikan
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full" />
            Sisa ≤ 3 hari
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full" />
            Aman
          </span>
        </div>

        {Array.isArray(ListData?.data) && ListData.data.length > 0 ? (
          ListData.data.map((item, idx) => (
            <ReminderCard
              key={idx}
              title={item.nama}
              status={item.status}
              endDate={item.tgl_terakhir}
              remainingDays={item.sisa_hari}
            />
          ))
        ) : (
          <p className="py-6 text-sm text-center text-gray-500">
            Data alokasi jadwal tidak ditemukan
          </p>
        )}

        <p className="mt-4 text-xs text-center text-gray-600">
          Untuk mengajukan perubahan jadwal, hubungi Admin/Kepala Unit.
        </p>
      </div>
    </div>
  );
}
