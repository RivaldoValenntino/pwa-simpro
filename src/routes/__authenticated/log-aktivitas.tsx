import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  EyeIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
export const Route = createFileRoute("/__authenticated/log-aktivitas")({
  component: RouteComponent,
});
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { listDataActivityUserQuery } from "../../queries/fetch-activity-user";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth";
import { formatTanggalIndo } from "../../utils/date-helper";
function RouteComponent() {
  const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
  const [tanggalAwal, setTanggalAwal] = useState(today);
  const [tanggalAkhir, setTanggalAkhir] = useState(today);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedData, setSelectedData] = useState<any>(null);

  useEffect(() => {
    setTanggalAwal(today);
    setTanggalAkhir(today);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [page, setPage] = useState(1);
  const limit = 20;

  const id_petugas = useAuthStore.getState().user?.id;
  const {
    data: LogData,
    isLoading,
    isFetching,
  } = useQuery(
    listDataActivityUserQuery(
      id_petugas,
      tanggalAwal,
      tanggalAkhir,
      limit,
      (page - 1) * limit
    )
  );

  // const handleRefresh = () => {
  //   queryClient.invalidateQueries({
  //     queryKey: [
  //       "listDataActivityUserQuery",
  //       id_petugas,
  //       tanggalAwal,
  //       tanggalAkhir,
  //       limit,
  //       (page - 1) * limit,
  //     ],
  //   });
  //   setPage(1);
  // };
  return (
    <div className="bg-whiteCust w-full rounded-xl p-4">
      {/* <DropdownJenis /> */}
      {/* 
      <div className="w-full flex items-center justify-end mt-4">
        <button
          className="px-2 py-1 text-xs bg-primary rounded hover:bg-primary/80 disabled:opacity-80 flex items-center justify-center text-white"
          onClick={handleRefresh}
        >
          <ArrowPathIcon className="w-3 h-3 inline-block mr-1" />
          Refresh
        </button>
      </div> */}
      <div className="mt-4 flex gap-4 w-full">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Awal
          </label>
          <Flatpickr
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
            options={{ dateFormat: "Y-m-d", disableMobile: true }}
            value={tanggalAwal}
            onChange={([date]) =>
              setTanggalAwal(date.toLocaleDateString("sv-SE"))
            }
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Akhir
          </label>
          <Flatpickr
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
            options={{ dateFormat: "Y-m-d", disableMobile: true }}
            value={tanggalAkhir}
            onChange={([date]) => {
              const selected = date.toLocaleDateString("sv-SE");
              if (selected < tanggalAwal) {
                setTanggalAkhir(today);
              } else {
                setTanggalAkhir(selected);
              }
            }}
          />
        </div>
      </div>

      <div className="mt-6 w-full overflow-x-auto">
        <div className="overflow-hidden rounded-xl">
          <table className="w-full table-auto border border-gray-100 text-sm text-left rounded-xl shadow-sm">
            <thead className="bg-gray-100 text-xs font-semibold text-gray-500 uppercase text-center">
              <tr>
                {/* <th className="p-2 border-b">No </th> */}
                <th className="p-2 border-b">Tanggal</th>
                <th className="p-2 border-b">Aksi</th>
                <th className="p-2 border-b">#</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800 text-center rounded-xl">
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={3} className="p-4">
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : LogData?.data?.length === 0 ? (
                <tr className="bg-white">
                  <td colSpan={3} className="p-4 text-gray-500 italic">
                    Data tidak ditemukan
                  </td>
                </tr>
              ) : (
                LogData?.data?.map((item) => (
                  <tr key={item.id} className="bg-white hover:bg-gray-50">
                    <td className="p-2 text-xs border">
                      {formatTanggalIndo(item.tgl)}, {item.jam}
                    </td>
                    <td className="p-2 text-xs border ">
                      {item.action.replace(/_/g, " ")}
                    </td>
                    <td
                      className="p-2 flex items-center justify-center h-full"
                      onClick={() => {
                        try {
                          const parsed = JSON.parse(item.data);
                          setSelectedData(parsed);
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } catch (err: any) {
                          console.error("Error parsing JSON:", err);
                          setSelectedData({ error: "Data tidak valid" });
                        }
                        setShowModal(true);
                      }}
                    >
                      <EyeIcon className="w-6 h-6 text-primary cursor-pointer hover:text-primary/80" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center text-sm mt-4 mb-20">
            <button
              className="px-4 py-2 bg-primary rounded hover:bg-primary/80 disabled:opacity-80 flex items-center justify-center text-white"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              <ArrowLeftCircleIcon className="w-5 h-5 inline-block mr-1" />
              Prev
            </button>
            <p className="text-gray-500 font-semibold">Page {page}</p>
            <button
              className="px-4 py-2 bg-primary rounded hover:bg-primary/80 disabled:opacity-80 flex items-center justify-center text-white"
              onClick={() => setPage((p) => p + 1)}
              disabled={(LogData?.data ?? []).length < limit}
            >
              Next
              <ArrowRightCircleIcon className="w-5 h-5 inline-block ml-1" />
            </button>
          </div>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-full max-w-xs p-6 bg-white rounded-xl shadow-xl">
                <h1 className="text-lg font-bold mb-4">Detail Aktivitas</h1>

                {/* Konten dibatasi tinggi dan bisa scroll */}
                <div className="space-y-2 max-w-xs max-h-64 overflow-y-auto pr-2">
                  {selectedData &&
                    Object.entries(selectedData)
                      .filter(
                        ([key]) =>
                          key !== "id_petugas" &&
                          key !== "id_dt" &&
                          key !== "id"
                      )
                      .map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-semibold capitalize">
                            {key === "vfilename"
                              ? "File"
                              : key.replace(/_/g, " ")}
                            :
                          </span>{" "}
                          <span className="break-words block">
                            {typeof value === "string" &&
                            value.startsWith("https") ? (
                              <img
                                src={value}
                                alt={key}
                                className="mt-1 rounded-md w-24 h-24 border"
                              />
                            ) : typeof value === "string" ||
                              typeof value === "number" ? (
                              value
                            ) : (
                              JSON.stringify(value)
                            )}
                          </span>
                        </div>
                      ))}
                </div>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedData(null);
                  }}
                  className="w-full py-2 mt-4 font-semibold text-white rounded-md bg-primary"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
