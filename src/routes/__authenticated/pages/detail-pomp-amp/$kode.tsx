import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import PompAmpCard from "../../../../components/POMP-AMP/pomp-amp-card";
import FilterButton from "../../../../components/ui/filter-button";
import TimeInfo from "../../../../components/time-info";
import SkeletonListData from "../../../../components/skeleton/skeleton-list-data";
import { queryClient } from "../../../../main";
import { useState } from "react";
import { useServerTime } from "../../../../hooks/useServerTime";
import { useAuthStore } from "../../../../store/auth";
import { listPompaAmpereQuery } from "../../../../queries/pomp-amp/list-pomp-amp";
import { useQuery } from "@tanstack/react-query";
import Total from "../../../../components/ui/total";
import BackButton from "../../../../components/back-button";
import { useDateGlobal } from "../../../../store/date";
import { checkisPastJamFn } from "../../../../utils/date-helper";

export const Route = createFileRoute(
  "/__authenticated/pages/detail-pomp-amp/$kode"
)({
  component: RouteComponent,
});

function RouteComponent() {
  // YYYY-MM-DD
  const time = useServerTime();
  const tanggalGlobal = useDateGlobal((s) => s.tanggal_global);

  const dateNow =
    tanggalGlobal?.toISOString().split("T")[0] ??
    time?.toISOString().split("T")[0];
  const { kode } = useParams({ strict: false });
  const { jam } = useSearch({ strict: false });
  const { type } = useSearch({ strict: false });
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
  } = useQuery(
    listPompaAmpereQuery(dateNow, kode, Number(id_installasi), jam, type)
  );

  const totalData = detailData?.data.length;
  const selesaiData = detailData?.data.filter(
    (item) => item.waktu_catat !== null && item.id_petugas !== null
  ).length;

  const filteredData = detailData?.data.filter((item) =>
    activeFilter === "sudah"
      ? item.id_petugas !== null
      : item.id_petugas === null
  );

  const handleReload = () => {
    queryClient.invalidateQueries({
      queryKey: [
        "listPompaAmpereQuery",
        dateNow,
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
              title={`Ampere Pompa (Jam ${jam})`}
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
            title={`Ampere Pompa (Jam ${jam})`}
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
          {filteredData?.map((pompaamp) => (
            <PompAmpCard
              images={pompaamp.files}
              isPast={isPastJam}
              waktuCatat={pompaamp.waktu_catat}
              btnColor={
                !pompaamp.id_petugas
                  ? "bg-greenCust hover:bg-greenCust/80"
                  : "bg-[#87BE26] hover:bg-[#87BE26]/80"
              }
              onAction={() =>
                navigate({
                  to: `/form/pomp-amp/${pompaamp.id}?kode=${kode}&id_pompa=${pompaamp.id_pompa}&jam=${pompaamp.jam}&id_trans=${pompaamp.id_trans}&jml_pompa=${Number(pompaamp.jml_pompa)}&type=${type || ""}`,
                })
              }
              bgColor={
                !pompaamp.id_petugas
                  ? "bg-white text-black"
                  : "bg-primary text-white"
              }
              isDone={Number(pompaamp.id_petugas)}
              titleAction={pompaamp.id_petugas ? "Edit Ampere" : "Catat Ampere"}
              key={pompaamp.id}
              title={pompaamp.nama_pompa}
              jumlahPompa={Number(pompaamp.jml_pompa) || 0}
              AktifTerbaca={Number(pompaamp.count_status_on) || 0}
              TidakAktif={Number(pompaamp.count_status_off) || 0}
            />
          ))}
        </div>
      </div>
    </>
  );
}
