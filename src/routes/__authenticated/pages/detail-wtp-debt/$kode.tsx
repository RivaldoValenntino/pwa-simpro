import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import TimeInfo from "../../../../components/time-info";
import FilterButton from "../../../../components/ui/filter-button";
import WtpDebtCard from "../../../../components/WTP-DEBT/wtp-debt-card";
import NoImage from "../../../../assets/images/no-image.jpg";
import SkeletonListData from "../../../../components/skeleton/skeleton-list-data";
import { useServerTime } from "../../../../hooks/useServerTime";
import { useState } from "react";
import { useAuthStore } from "../../../../store/auth";
import { useQuery } from "@tanstack/react-query";
import { listWtpDebtQuery } from "../../../../queries/wtp-debt/list-wtp-debt";
import { queryClient } from "../../../../main";
import Total from "../../../../components/ui/total";
import BackButton from "../../../../components/back-button";
import { useDateGlobal } from "../../../../store/date";
import { checkisPastJamFn } from "../../../../utils/date-helper";

export const Route = createFileRoute(
  "/__authenticated/pages/detail-wtp-debt/$kode"
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
  const {
    data: detailData,
    isLoading,
    isFetching,
  } = useQuery(listWtpDebtQuery(dateServer, kode, Number(id_installasi), jam));

  const currentHour = time?.getHours() ?? 0; // 0-23
  const isPastJam = checkisPastJamFn(Number(jam), currentHour);

  const totalData = detailData?.data.length;
  const selesaiData = detailData?.data.filter(
    (item) =>
      item.waktu_catat !== null && item.debit_ld !== null && item.file !== null
  ).length;

  const filteredData = detailData?.data.filter((item) =>
    activeFilter === "sudah" ? item.debit_ld !== null : item.debit_ld === null
  );

  const handleReload = () => {
    queryClient.invalidateQueries({
      queryKey: [
        "listWtpDebtQuery",
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
              title={`Debit Air Baku(L/D) (Jam ${jam})`}
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
            title={`Debit Air Baku(L/D) (Jam ${jam})`}
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
          {filteredData?.map((wtpdebt) => (
            <WtpDebtCard
              isPast={isPastJam}
              waktuCatat={wtpdebt.waktu_catat}
              btnColor={
                !wtpdebt.debit_ld
                  ? "bg-greenCust hover:bg-greenCust/80"
                  : "bg-[#87BE26] hover:bg-[#87BE26]/80"
              }
              onAction={() =>
                navigate({
                  to: `/form/wtp-debt/${wtpdebt.id}?kode=${kode}&id_wtp=${wtpdebt.id_wtp}&jam=${wtpdebt.jam}&id_trans=${wtpdebt.id_trans}`,
                })
              }
              bgColor={
                !wtpdebt.debit_ld
                  ? "bg-white text-black"
                  : "bg-primary text-white"
              }
              titleAction={
                wtpdebt.debit_ld
                  ? "Edit Debit Air Baku (L/D)"
                  : "Catat Debit Air Baku(L/D)"
              }
              image={
                wtpdebt.file === "" || wtpdebt.file === null
                  ? NoImage
                  : wtpdebt.file
              }
              key={wtpdebt.id}
              title={wtpdebt.nama_wtp}
              debitSebelumnya={Number(wtpdebt.wtp_awal) || 0}
              debitSekarang={Number(wtpdebt.debit_ld) || 0}
            />
          ))}
        </div>
      </div>
    </>
  );
}
