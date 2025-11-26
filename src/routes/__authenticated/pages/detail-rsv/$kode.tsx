import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import NoImage from "../../../../assets/images/no-image.jpg";
import RsvCard from "../../../../components/RSV/rsv-card";
import FilterButton from "../../../../components/ui/filter-button";
import Total from "../../../../components/ui/total";
import TimeInfo from "../../../../components/time-info";
import SkeletonListData from "../../../../components/skeleton/skeleton-list-data";
import { queryClient } from "../../../../main";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthStore } from "../../../../store/auth";
import { useServerTime } from "../../../../hooks/useServerTime";
import { listReservoarQuery } from "../../../../queries/rsv/list-rsv";
import BackButton from "../../../../components/back-button";
import { useDateGlobal } from "../../../../store/date";
import { checkisPastJamFn } from "../../../../utils/date-helper";

export const Route = createFileRoute("/__authenticated/pages/detail-rsv/$kode")(
  {
    component: RouteComponent,
  }
);

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
  const {
    data: detailData,
    isLoading,
    isFetching,
  } = useQuery(
    listReservoarQuery(dateServer, kode, Number(id_installasi), jam)
  );

  const currentHour = time?.getHours() ?? 0; // 0-23
  const isPastJam = checkisPastJamFn(Number(jam), currentHour);

  const totalData = detailData?.data.length;
  const selesaiData = detailData?.data.filter(
    (item) =>
      item.waktu_catat_level !== null &&
      item.level_air !== null &&
      item.file_level !== null
  ).length;

  const filteredData = detailData?.data.filter((item) =>
    activeFilter === "sudah" ? item.level_air !== null : item.level_air === null
  );

  const handleReload = () => {
    queryClient.invalidateQueries({
      queryKey: [
        "listSungaiQuery",
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
              title={`Level Reservoar (Jam ${jam})`}
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
            title={`Level Reservoar (Jam ${jam})`}
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
          {filteredData?.map((rsv) => (
            <RsvCard
              isPast={isPastJam}
              waktuCatat={rsv.waktu_catat_level}
              btnColor={
                !rsv.level_air
                  ? "bg-greenCust hover:bg-greenCust/80"
                  : "bg-[#87BE26] hover:bg-[#87BE26]/80"
              }
              onAction={() =>
                navigate({
                  to: "/form/rsv/$id",
                  params: {
                    id: rsv.id,
                  },
                  search: {
                    kode,
                    id_reservoar: Number(rsv.id_reservoar),
                    jam: Number(jam),
                    id_trans: Number(rsv.id_trans),
                  },
                })
              }
              bgColor={
                !rsv.level_air ? "bg-white text-black" : "bg-primary text-white"
              }
              titleAction={
                rsv.level_air ? "Edit Level Reservoar" : "Catat Level Reservoar"
              }
              image={
                rsv.file_level === "" || rsv.file_level === null
                  ? NoImage
                  : rsv.file_level
              }
              key={rsv.id}
              title={rsv.nama_reservoar}
              levelAirSebelumnya={Number(rsv.level_awal) || 0}
              levelAirSekarang={Number(rsv.level_air) || 0}
            />
          ))}
        </div>
      </div>
    </>
  );
}
