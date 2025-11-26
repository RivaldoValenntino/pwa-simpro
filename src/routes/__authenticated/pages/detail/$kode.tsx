import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import TimeInfo from "../../../../components/time-info";
import Kubikasi from "../../../../components/ui/total";
import MeterCard from "../../../../components/METER/meter-card";
import NoImage from "../../../../assets/images/no-image.jpg";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../../store/auth";
import { listDataMeterQuery } from "../../../../queries/meter/list-data-meter";
import SkeletonListData from "../../../../components/skeleton/skeleton-list-data";
import FilterButton from "../../../../components/ui/filter-button";
import { useState } from "react";
import Total from "../../../../components/ui/total";
import BackButton from "../../../../components/back-button";
import { useServerTime } from "../../../../hooks/useServerTime";
import { useDateGlobal } from "../../../../store/date";
import { checkisPastJamFn } from "../../../../utils/date-helper";
export const Route = createFileRoute("/__authenticated/pages/detail/$kode")({
  component: RouteComponent,
});

function RouteComponent() {
  const time = useServerTime();
  const tanggalGlobal = useDateGlobal((s) => s.tanggal_global);
  const navigate = useNavigate();
  const dateServer =
    tanggalGlobal?.toISOString().split("T")[0] ??
    time?.toISOString().split("T")[0];

  const { kode } = useParams({ strict: false });
  const { jam } = useSearch({ strict: false });
  const { type } = useSearch({ strict: false });

  if (!jam) navigate({ to: "/not-found" });

  const currentHour = time?.getHours() ?? 0; // 0-23
  const isPastJam = checkisPastJamFn(Number(jam), currentHour);

  const [activeFilter, setActiveFilter] = useState<"sudah" | "belum">("belum");
  const id_installasi = useAuthStore.getState().user?.id_installasi;
  const {
    data: detailData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    listDataMeterQuery(dateServer, kode, Number(id_installasi), jam, type)
  );

  const filteredData = detailData?.data.filter((item) =>
    activeFilter === "sudah"
      ? item.waktu_catat !== null
      : item.waktu_catat === null
  );

  const totalData = detailData?.data.length;
  const selesaiData = detailData?.data.filter(
    (item) => item.waktu_catat !== null
  ).length;

  if (isLoading || isFetching) return <SkeletonListData />;

  if (!filteredData || filteredData.length === 0) {
    return (
      <>
        <div className="w-full p-4 overflow-hidden shadow-xs bg-whiteCust rounded-xl">
          <BackButton to={`/list-data/`} search={{ jam, type }} />
          <TimeInfo />
          <div className="relative w-full">
            <Kubikasi
              total={totalData}
              selesai={selesaiData}
              title={`Stand Meter (Jam ${jam})`}
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
              onClick={() => refetch()}
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
      <div className="w-full p-4 overflow-hidden shadow-xs bg-whiteCust rounded-xl">
        <BackButton to={`/list-data/`} search={{ jam, type }} />
        <TimeInfo />
        <div className="relative w-full">
          <Total
            total={totalData}
            selesai={selesaiData}
            title={`Stand Meter (Jam ${jam})`}
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
          {filteredData?.map((meter) => (
            <MeterCard
              isPast={isPastJam}
              waktuCatat={meter.waktu_catat}
              btnColor={
                !meter.waktu_catat
                  ? "bg-greenCust hover:bg-greenCust/80"
                  : "bg-[#87BE26] hover:bg-[#87BE26]/80"
              }
              onAction={() =>
                navigate({
                  to: `/form/meter/${meter.id}`,
                  search: {
                    kode,
                    id_meter: Number(meter.id_meter_produksi),
                    jam: Number(jam),
                    id_trans: Number(meter.id_trans),
                    type,
                  },
                })
              }
              bgColor={
                !meter.waktu_catat
                  ? "bg-white text-black"
                  : "bg-primary text-white"
              }
              titleAction={
                meter.waktu_catat ? "Edit Stand Meter" : "Catat Stand Meter"
              }
              image={
                meter.file === "" || meter.file === null ? NoImage : meter.file
              }
              key={meter.id}
              title={meter.nama_meter_produksi}
              meterAwal={meter.stand_awal_sblm ?? 0}
              meterAkhir={meter.st_akhir ?? 0}
              pemakaian={
                meter.st_akhir
                  ? meter.st_akhir - (meter.st_awal ?? 0)
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}
