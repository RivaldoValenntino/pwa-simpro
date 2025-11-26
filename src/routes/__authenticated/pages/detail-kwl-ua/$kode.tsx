import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import TimeInfo from "../../../../components/time-info";
import KwluaCard from "../../../../components/KWLUA/kwlua-card";
import { listDataKwluaQuery } from "../../../../queries/kwlua/list-data-kwlua";
import { useAuthStore } from "../../../../store/auth";
import { useQuery } from "@tanstack/react-query";
import KwluaSkeletonListData from "../../../../components/skeleton/kwlua/list-kwlua-skeleton";
import Total from "../../../../components/ui/total";
import { useServerTime } from "../../../../hooks/useServerTime";
import FilterButton from "../../../../components/ui/filter-button";
import { useState } from "react";
import { queryClient } from "../../../../main";
import BackButton from "../../../../components/back-button";
import { useDateGlobal } from "../../../../store/date";
import { DetailModalKwluaQuery } from "../../../../queries/kwlua/detail-modal";
import FullScreenSpinner from "../../../../components/full-screen-spinner";
import { checkisPastJamFn } from "../../../../utils/date-helper";

export const Route = createFileRoute(
  "/__authenticated/pages/detail-kwl-ua/$kode"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const id_installasi = useAuthStore.getState().user?.id_installasi;
  const { kode } = useParams({ strict: false });
  const { jam } = useSearch({ strict: false });
  const navigate = useNavigate();
  const time = useServerTime();
  const tanggalGlobal = useDateGlobal((s) => s.tanggal_global);

  const currentHour = time?.getHours() ?? 0; // 0-23

  const isPastJam = checkisPastJamFn(Number(jam), currentHour);

  const dateNow =
    tanggalGlobal?.toISOString().split("T")[0] ??
    time?.toISOString().split("T")[0];
  const [activeFilter, setActiveFilter] = useState<"sudah" | "belum">("belum");
  const {
    data: ListData,
    isLoading,
    isFetching,
  } = useQuery(listDataKwluaQuery(dateNow, kode, Number(id_installasi), jam));

  const totalData = ListData?.data.length;
  const selesaiData = ListData?.data.filter(
    (item) => item.id_petugas !== null
  ).length;
  // const selesaiData = ListData?.data.filter(
  //   (item) =>
  //     item.air_baku_ntu !== null &&
  //     item.air_baku_ph !== null &&
  //     item.air_sediment_ntu !== null &&
  //     item.air_sediment_ph !== null &&
  //     item.air_produksi_ntu !== null &&
  //     item.air_produksi_ph !== null
  // ).length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const isSelesai = (item: any) =>
  //   item.waktu_catat_air_baku_ntu !== null &&
  //   item.waktu_catat_air_baku_ph !== null &&
  //   item.waktu_catat_air_sediment_ntu !== null &&
  //   item.waktu_catat_air_sediment_ph !== null &&
  //   item.waktu_catat_air_produksi_ntu !== null &&
  //   item.waktu_catat_air_produksi_ph !== null;

  // const filteredData = ListData?.data.filter((item) =>
  //   activeFilter === "sudah" ? isSelesai(item) : !isSelesai(item)
  // );
  const filteredData = ListData?.data.filter((item) =>
    activeFilter === "sudah"
      ? item.id_petugas !== null
      : item.id_petugas === null
  );
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<{ id: number; type: string } | null>(
    null
  );

  const { data: detailData, isLoading: loadingDetail } = useQuery(
    DetailModalKwluaQuery(selected?.id ?? 0, selected?.type)
  );
  if (!jam) navigate({ to: "/not-found" });
  const handleReload = () => {
    queryClient.invalidateQueries({
      queryKey: [
        "listDataKwluaQuery",
        dateNow,
        kode,
        Number(id_installasi),
        jam,
      ],
    });
  };
  if (isLoading || isFetching) return <KwluaSkeletonListData />;

  if (!filteredData || filteredData.length === 0) {
    return (
      <>
        <div className="w-full p-4 overflow-hidden shadow-xs bg-whiteCust rounded-xl">
          <BackButton to={`/list-data/`} search={{ jam }} />
          <TimeInfo />
          <div className="relative w-full">
            <Total
              total={totalData}
              selesai={selesaiData}
              title={`Kwalitas (Jam ${jam})`}
            />
            <FilterButton
              className="absolute left-0 right-0 px-4 -bottom-8"
              activeFilter={activeFilter}
              btnDoneColor="bg-primary"
              btnUndoneColor="bg-orangeCust"
              onFilterChange={(filter) => setActiveFilter(filter)}
            />
          </div>
          <div className="flex flex-col items-center justify-center h-full gap-4 pb-32 mt-20">
            <h1 className="font-semibold">Data Tidak Tersedia</h1>
            <button
              className="px-3 py-2 text-white rounded-md cursor-pointer bg-primary"
              type="button"
              onClick={handleReload}
            >
              Muat Ulang
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="w-full p-4 overflow-hidden shadow-xs bg-whiteCust rounded-xl">
      <BackButton to={`/list-data/`} search={{ jam }} />
      <TimeInfo />
      {loadingDetail && <FullScreenSpinner />}
      <div className="relative w-full mb-12">
        <Total
          total={totalData}
          selesai={selesaiData}
          title={`Kwalitas (Jam ${jam})`}
        />

        <FilterButton
          className="absolute left-0 right-0 px-4 -bottom-8"
          activeFilter={activeFilter}
          btnDoneColor="bg-primary"
          btnUndoneColor="bg-orangeCust"
          onFilterChange={(filter) => setActiveFilter(filter)}
        />
      </div>
      {filteredData?.map((item) => (
        <KwluaCard
          isPast={isPastJam}
          key={item.id}
          nama_wtp={item.nama_wtp}
          air_baku_ntu={item.air_baku_ntu}
          air_baku_ph={item.air_baku_ph}
          air_sediment_ntu={item.air_sediment_ntu}
          air_sediment_ph={item.air_sediment_ph}
          air_produksi_ntu={item.air_produksi_ntu}
          air_produksi_ph={item.air_produksi_ph}
          onLihatDetail={(type) => {
            setSelected({ id: Number(item.id), type });
            setOpenModal(true);
          }}
          onCatat={(type) =>
            navigate({
              to: `/form/kwlua/${item.id}`,
              search: {
                type,
                jam,
                kode_trans: kode,
                id_wtp: Number(item.id_wtp),
              },
            })
          }
        />
      ))}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm p-6 bg-white shadow-xl rounded-xl">
            <h3 className="mb-4 text-lg font-bold text-center">
              Detail Data Kwalitas
            </h3>

            <ul className="mb-4 space-y-2 text-sm text-gray-700">
              {detailData?.data &&
                Object.entries(detailData.data[0]).map(([key, val], idx) => {
                  const hideKey =
                    key.startsWith("id") || key.startsWith("stts");
                  return (
                    !hideKey && (
                      <li
                        key={idx}
                        className="flex items-center justify-between gap-2 pb-1 border-b"
                      >
                        <span className="capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        {typeof val === "string" && val.startsWith("http") ? (
                          <img
                            src={val}
                            alt={key}
                            className="w-24 h-24 rounded-md"
                          />
                        ) : (
                          <span className="font-semibold">
                            {String(val).replace("null", "-")}
                          </span>
                        )}
                      </li>
                    )
                  );
                })}
            </ul>
            <button
              onClick={() => {
                setOpenModal(false);
                setSelected(null);
              }}
              className="w-full py-2 mt-4 font-semibold text-white rounded-md bg-primary"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
