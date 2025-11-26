import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import NoImage from "../../../../assets/images/no-image.jpg";
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
import DosisCard from "../../../../components/DOSIS/dosis-card";
import BackButton from "../../../../components/back-button";
import { useDateGlobal } from "../../../../store/date";
import { checkisPastJamFn } from "../../../../utils/date-helper";

export const Route = createFileRoute(
  "/__authenticated/pages/detail-dosis/$kode"
)({
  component: RouteComponent,
});

function RouteComponent() {
  // YYYY-MM-DD
  const time = useServerTime();
  const navigate = useNavigate();

  const tanggalGlobal = useDateGlobal((s) => s.tanggal_global);

  const dateNow =
    tanggalGlobal?.toISOString().split("T")[0] ??
    time?.toISOString().split("T")[0];
  const kode = "RSV";
  const { jam } = useSearch({ strict: false });
  if (!jam) navigate({ to: "/not-found" });
  const [activeFilter, setActiveFilter] = useState<"sudah" | "belum">("belum");
  const id_installasi = useAuthStore.getState().user?.id_installasi;
  const {
    data: detailData,
    isLoading,
    isFetching,
  } = useQuery(listReservoarQuery(dateNow, kode, Number(id_installasi), jam));

  const currentHour = time?.getHours() ?? 0; // 0-23
  const isPastJam = checkisPastJamFn(Number(jam), currentHour);

  const totalData = detailData?.data.length;

  const selesaiData = detailData?.data.filter(
    (item) => item.ppm !== null && item.sisa_khlor !== null
  ).length;

  const filteredData = detailData?.data.filter((item) =>
    activeFilter === "sudah"
      ? item.ppm !== null && item.sisa_khlor !== null
      : item.ppm === null || item.sisa_khlor === null
  );

  const handleReload = () => {
    queryClient.invalidateQueries({
      queryKey: ["listSungaiQuery", dateNow, kode, Number(id_installasi), jam],
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
              title={`Sisa Khlor (Jam ${jam})`}
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
            title={`Sisa Khlor (Jam ${jam})`}
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
          {filteredData?.map((dosis) => {
            const isCompleted = dosis.ppm !== null && dosis.sisa_khlor !== null;

            return (
              <DosisCard
                isPast={isPastJam}
                waktuCatat={dosis.waktu_catat_khlor}
                btnColor={
                  isCompleted
                    ? "bg-[#87BE26] hover:bg-[#87BE26]/80"
                    : "bg-greenCust hover:bg-greenCust/80"
                }
                onAction={() =>
                  navigate({
                    to: "/form/dosis/$id",
                    params: {
                      id: dosis.id,
                    },
                    search: {
                      kode,
                      id_reservoar: Number(dosis.id_reservoar),
                      jam: Number(jam),
                      nama: dosis.nama_reservoar,
                      id_trans: Number(dosis.id_trans),
                    },
                  })
                }
                bgColor={
                  isCompleted ? "bg-primary text-white" : "bg-white text-black"
                }
                titleAction={
                  isCompleted ? "Edit Sisa Khlor" : "Catat Sisa Khlor"
                }
                image={
                  dosis.file_khlor === null || dosis.file_khlor === ""
                    ? NoImage
                    : dosis.file_khlor
                }
                key={dosis.id}
                title={dosis.nama_reservoar}
                standPpm={Number(dosis.ppm) || 0}
                sisaKhlor={Number(dosis.sisa_khlor) || 0}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
