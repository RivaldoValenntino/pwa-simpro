import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import TimeInfo from "../../../../components/time-info";
import FilterButton from "../../../../components/ui/filter-button";
import PompAtmCard from "../../../../components/POMP-ATM/pomp-atm-card";
import NoImage from "../../../../assets/images/no-image.jpg";
import { useServerTime } from "../../../../hooks/useServerTime";
import { useState } from "react";
import SkeletonListData from "../../../../components/skeleton/skeleton-list-data";
import { queryClient } from "../../../../main";
import { listPompAtmQuery } from "../../../../queries/pomp-atm/list-pomp-atm";
import { useAuthStore } from "../../../../store/auth";
import { useQuery } from "@tanstack/react-query";
import Total from "../../../../components/ui/total";
import BackButton from "../../../../components/back-button";
import { useDateGlobal } from "../../../../store/date";
import { checkisPastJamFn } from "../../../../utils/date-helper";
export const Route = createFileRoute(
  "/__authenticated/pages/detail-pomp-atm/$kode"
)({
  component: RouteComponent,
});

function RouteComponent() {
  // YYYY-MM-DD
  const time = useServerTime();
  const tanggalGlobal = useDateGlobal((s) => s.tanggal_global);

  const dateServer =
    tanggalGlobal?.toISOString().split("T")[0] ??
    time?.toISOString().split("T")[0];
  const { kode } = useParams({ strict: false });
  const { jam } = useSearch({ strict: false });
  const [activeFilter, setActiveFilter] = useState<"sudah" | "belum">("belum");
  const navigate = useNavigate();
  if (!jam) navigate({ to: "/not-found" });
  const id_installasi = useAuthStore.getState().user?.id_installasi;

  const currentHour = time?.getHours() ?? 0; // 0-23
  const isPastJam = checkisPastJamFn(Number(jam), currentHour);

  const {
    data: detailData,
    isLoading,
    isFetching,
  } = useQuery(listPompAtmQuery(dateServer, kode, Number(id_installasi), jam));

  const totalData = detailData?.data.length;
  const selesaiData = detailData?.data.filter(
    (item) =>
      item.waktu_catat !== null && item.atm !== null && item.file !== null
  ).length;

  const filteredData = detailData?.data.filter((item) =>
    activeFilter === "sudah" ? item.atm !== null : item.atm === null
  );

  const handleReload = () => {
    queryClient.invalidateQueries({
      queryKey: [
        "listPompAtmQuery",
        dateServer,
        kode,
        Number(id_installasi),
        jam,
      ],
    });
  };

  if (isLoading || isFetching) return <SkeletonListData />;

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
              title={`Tekanan Kolektor(ATM) (Jam ${jam})`}
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
    <>
      <div className="w-full p-4 overflow-hidden shadow-xs bg-whiteCust rounded-xl ">
        <BackButton to={`/list-data/`} search={{ jam }} />
        <TimeInfo />
        <div className="relative w-full">
          <Total
            total={totalData}
            selesai={selesaiData}
            title={`Tekanan Kolektor(ATM) (Jam ${jam})`}
          />

          <FilterButton
            className="absolute left-0 right-0 px-4 -bottom-8"
            activeFilter={activeFilter}
            btnDoneColor="bg-primary"
            btnUndoneColor="bg-orangeCust"
            onFilterChange={(filter) => setActiveFilter(filter)}
          />
        </div>

        <div className="mt-12">
          {filteredData?.map((pompatm) => (
            <PompAtmCard
              isPast={isPastJam}
              waktuCatat={pompatm.waktu_catat}
              btnColor={
                !pompatm.atm
                  ? "bg-greenCust hover:bg-greenCust/80"
                  : "bg-[#87BE26] hover:bg-[#87BE26]/80"
              }
              onAction={() =>
                navigate({
                  to: "/form/pomp-atm/$id",
                  params: {
                    id: pompatm.id,
                  },
                  search: {
                    kode: String(kode),
                    id_pompa_tekanan_kolektor: Number(
                      pompatm.id_pompa_tekanan_kolektor
                    ),
                    jam: Number(jam),
                    id_trans: Number(pompatm.id_trans),
                  },
                })
              }
              bgColor={
                !pompatm.atm ? "bg-white text-black" : "bg-primary text-white"
              }
              titleAction={
                pompatm.atm ? "Edit Tekanan Kolektor" : "Catat Tekanan Kolektor"
              }
              image={
                pompatm.file === "" || pompatm.file === null
                  ? NoImage
                  : pompatm.file
              }
              key={pompatm.id}
              title={pompatm.nama_pompa}
              nilaiAtmSebelumnya={Number(pompatm.atm_awal) || 0}
              nilaiAtmSekarang={Number(pompatm.atm) || 0}
            />
          ))}
        </div>
      </div>
    </>
  );
}
