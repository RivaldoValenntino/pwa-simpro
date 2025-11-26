import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listCipoletyQuery } from "../../../../queries/cipolety/list-cplt";
import { useAuthStore } from "../../../../store/auth";
import z from "zod";
import { CipoletyCard } from "../../../../components/CIPOLETY/cipolety-card";
import TimeInfo from "../../../../components/time-info";
import FilterButton from "../../../../components/ui/filter-button";
import Total from "../../../../components/ui/total";
import { useState } from "react";
import SkeletonListData from "../../../../components/skeleton/skeleton-list-data";
import { queryClient } from "../../../../main";
import NoImage from "../../../../assets/images/no-image.jpg";
import BackButton from "../../../../components/back-button";
import { useServerTime } from "../../../../hooks/useServerTime";
import { useDateGlobal } from "../../../../store/date";
import { checkisPastJamFn } from "../../../../utils/date-helper";
export const Route = createFileRoute(
  "/__authenticated/pages/detail-cplt/$kode"
)({
  component: RouteComponent,
  validateSearch: z.object({
    jam: z.number(),
  }),
});

function RouteComponent() {
  const time = useServerTime();
  const navigate = useNavigate();
  const tanggalGlobal = useDateGlobal((s) => s.tanggal_global);

  const dateServer =
    tanggalGlobal?.toISOString().split("T")[0] ??
    time?.toISOString().split("T")[0];
  const id_installasi = useAuthStore.getState().user?.id_installasi;
  const { kode } = useParams({ strict: false });
  const { jam } = useSearch({ strict: false });
  if (!jam) navigate({ to: "/not-found" });
  const [activeFilter, setActiveFilter] = useState<"sudah" | "belum">("belum");
  const {
    data: ListData,
    isLoading,
    isFetching,
  } = useQuery(listCipoletyQuery(dateServer, kode, Number(id_installasi), jam));

  const currentHour = time?.getHours() ?? 0; // 0-23
  const isPastJam = checkisPastJamFn(Number(jam), currentHour);

  const totalData = ListData?.data.length;
  const selesaiData = ListData?.data.filter(
    (item) =>
      item.waktu_catat_cipolety1 !== null && item.waktu_catat_cipolety2 !== null
  ).length;

  const filteredData = ListData?.data.filter((item) =>
    activeFilter === "sudah"
      ? item.id_petugas !== null &&
        item.waktu_catat_cipolety1 !== null &&
        item.waktu_catat_cipolety2 !== null
      : item.id_petugas === null ||
        item.waktu_catat_cipolety1 === null ||
        item.waktu_catat_cipolety2 === null
  );

  const handleReload = () => {
    queryClient.invalidateQueries({
      queryKey: [
        "listCipoletyQuery",
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
              title={`Cipolety (Jam ${jam})`}
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
      <div className="relative w-full">
        <Total
          total={totalData}
          selesai={selesaiData}
          title={`Cipolety (Jam ${jam})`}
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
        {filteredData?.map((item) => {
          const sudah =
            item.id_petugas !== null &&
            item.waktu_catat_cipolety1 !== null &&
            item.waktu_catat_cipolety2 !== null;

          let bgColor = "bg-white text-black";
          let btnClassName = "bg-greenCust hover:bg-greenCust/80 text-white";

          if (sudah) {
            bgColor = "bg-primary text-white";
            btnClassName = "bg-[#87BE26] hover:bg-[#87BE26]/80 text-white";
          }

          return (
            <CipoletyCard
              isPast={isPastJam}
              btnAction={() => {
                // if (sudah) {
                //   toast.success("Fitur ini masih dalam pengembangan");
                // } else {
                navigate({
                  to: "/form/cipolety/$id",
                  params: {
                    id: item.id,
                  },
                  search: {
                    id_wtp: Number(item.id_wtp),
                    kode,
                    jam: Number(jam),
                    id_trans: Number(item.id_trans),
                  },
                });

                // }
              }}
              bgColor={bgColor}
              btnClassName={btnClassName}
              btnTitle={sudah ? "Edit Cipolety" : "Catat Cipolety"}
              key={item.id}
              nama_wtp={item.nama_wtp}
              cipolety1_tinggi={item.cipolety1_tinggi}
              cipolety1_ld={item.cipolety1_ld}
              cipolety2_tinggi={item.cipolety2_tinggi}
              cipolety2_ld={item.cipolety2_ld}
              cipolety1_img={
                item.file_cipolety1 === null || item.file_cipolety1 === ""
                  ? NoImage
                  : item.file_cipolety1
              }
              cipolety2_img={
                item.file_cipolety2 === null || item.file_cipolety2 === ""
                  ? NoImage
                  : item.file_cipolety2
              }
            />
          );
        })}
      </div>
    </div>
  );
}
