import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { ListMeterPlnQuery } from "../../../../queries/meter-pln/list-pln";
import TimeInfo from "../../../../components/time-info";
import FilterButton from "../../../../components/ui/filter-button";
import { useState } from "react";
import MeterPlnCard from "../../../../components/PLN/mtr-pln-card";
import NoImage from "../../../../assets/images/no-image.jpg";
import { useAuthStore } from "../../../../store/auth";
import Total from "../../../../components/ui/total";
import SkeletonListData from "../../../../components/skeleton/skeleton-list-data";
import { queryClient } from "../../../../main";
import BackButton from "../../../../components/back-button";
import { useServerTime } from "../../../../hooks/useServerTime";
import { useDateGlobal } from "../../../../store/date";
import { checkisPastJamFn } from "../../../../utils/date-helper";
export const Route = createFileRoute("/__authenticated/pages/detail-pln/$kode")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const [activeFilter, setActiveFilter] = useState<"sudah" | "belum">("belum");
  const time = useServerTime();
  const tanggalGlobal = useDateGlobal((s) => s.tanggal_global);

  const dateServer =
    tanggalGlobal?.toISOString().split("T")[0] ??
    time?.toISOString().split("T")[0];
  const { kode } = useParams({ strict: false });
  const { jam } = useSearch({ strict: false });
  const id_installasi = useAuthStore.getState().user?.id_installasi;
  const navigate = useNavigate();
  if (!jam) navigate({ to: "/not-found" });
  const currentHour = time?.getHours() ?? 0; // 0-23
  const isPastJam = checkisPastJamFn(Number(jam), currentHour);

  const {
    data: ListMeterPln,
    isLoading,
    isFetching,
  } = useQuery(ListMeterPlnQuery(dateServer, kode, Number(id_installasi), jam));

  // console.log(ListMeterPln);

  const mappingData = ListMeterPln?.data?.flatMap((item) => [
    {
      type: "lwbp",
      title: "METER LWBP",
      awal: item.lwbp_prev,
      akhir: item.lwbp,
      satuan: "kWh",
      file: item.file_lwbp,
      latlong: item.latlong_lwbp,
      waktu_catat: item.waktu_catat_lwbp,
      ...item,
    },
    {
      type: "wbp",
      title: "METER WBP",
      awal: item.wbp_prev,
      akhir: item.wbp,
      satuan: "kWh",
      file: item.file_wbp,
      latlong: item.latlong_wbp,
      waktu_catat: item.waktu_catat_wbp,
      ...item,
    },
    {
      type: "kvrh",
      title: "METER KVRH",
      awal: item.kvrh_prev,
      akhir: item.kvrh,
      satuan: "kVArh",
      file: item.file_kvrh,
      latlong: item.latlong_kvrh,
      waktu_catat: item.waktu_catat_kvrh,
      ...item,
    },
  ]);
  const totalData = mappingData?.length || 0;
  const selesaiData =
    mappingData?.filter((item) => !!item.waktu_catat).length || 0;
  const filteredData = mappingData?.filter((item) =>
    activeFilter === "sudah"
      ? item.waktu_catat !== null
      : item.waktu_catat === null
  );

  const handleReload = () => {
    queryClient.invalidateQueries({
      queryKey: [
        "ListMeterPlnQuery",
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
              title={`Stand Meter PLN (Jam ${jam})`}
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
            title={`Stand Meter PLN (Jam ${jam})`}
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
          {filteredData?.map((mtrpln) => (
            <MeterPlnCard
              isPast={isPastJam}
              satuan={mtrpln.satuan}
              btnColor={
                !mtrpln.akhir
                  ? "bg-greenCust hover:bg-greenCust/80"
                  : "bg-[#87BE26] hover:bg-[#87BE26]/80"
              }
              onAction={() =>
                navigate({
                  to: "/form/meter-pln/$id",
                  params: {
                    id: mtrpln.id,
                  },
                  search: {
                    type: mtrpln.type,
                    jam: Number(jam),
                    kode_trans: kode,
                    id_meter: Number(mtrpln.id_meter_pln),
                    total: Number(totalData),
                    selesai: Number(selesaiData),
                  },
                })
              }
              bgColor={
                !mtrpln.akhir ? "bg-white text-black" : "bg-primary text-white"
              }
              titleAction={
                mtrpln.akhir ? "Edit Stand Meter PLN" : "Catat Stand Meter PLN"
              }
              image={
                mtrpln.file === null || mtrpln.file === ""
                  ? NoImage
                  : mtrpln.file
              }
              waktu={mtrpln.waktu_catat}
              key={`${mtrpln.id}-${mtrpln.type}`}
              title={mtrpln.title}
              nilaiSebelumnya={Number(mtrpln.awal) || 0}
              nilaiSekarang={Number(mtrpln.akhir) || 0}
              stand={mtrpln.type.toUpperCase()}
            />
          ))}
        </div>
      </div>
    </>
  );
}
