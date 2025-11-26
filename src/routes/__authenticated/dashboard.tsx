/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ShiftPicker from "../../components/shift-picker";
import DashboardInfoCard from "../../components/Dashboard/dashboard-info-card";
import DashboardSkeleton from "../../components/skeleton/dashboard-skeleton";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth";
import { useDashboardStore } from "../../store/dashboard-store";
import NextInputInfo from "../../components/Dashboard/next-input-info";
import { dashboardTransConfig } from "../../configDashboardTrans";
import DashboardInfoCardPompa from "../../components/POMPA/dashboard-info-card-pomp";
import Header from "../../components/Dashboard/header";
import DropdownDashboard from "../../components/drodpdown-dashboard";
import DashboardInfoCardDosis from "../../components/Dashboard/dashboard-info-dosis";
import PencucianInfoCard from "../../components/Dashboard/pencucian/pencucian-info-card";
import { getShiftPgwQuery } from "../../queries/fetch-shift";
import DashboardInfoMeter from "../../components/Dashboard/dashboard-info-meter";
import DashboardInfoCipolety from "../../components/Dashboard/dashboard-info-cipolety";
import DashboardCardReminder from "../../components/dashboard-card-reminder";
import { fetchProgressReminder } from "../../queries/dashboard/progress-reminder";
import { getShiftInfo } from "../../utils/helper";
export const Route = createFileRoute("/__authenticated/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const now = new Date();

  const kodeTrans = useDashboardStore((state) => state.selectedDashboard.value);
  const minutesNow = now.getMinutes();
  const id_installasi = useAuthStore.getState().user?.id_installasi;
  const scrollRef = useRef<HTMLDivElement>(null);

  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore.getState().user;
  const hour = now.getHours();
  if (hour === 7 && minutesNow < 50) {
    now.setDate(now.getDate() - 1);
  }
  const { data: shiftPgw, refetch: refetchShift } = useQuery(
    getShiftPgwQuery(now.toISOString().split("T")[0])
  );

  const { shiftHour, shiftDate } = getShiftInfo();

  const {
    data: ProgressReminder,
    isLoading: isLoadingProgressReminder,
    refetch: refetchProgress,
  } = useQuery(fetchProgressReminder(shiftHour, shiftDate));

  useEffect(() => {
    if (shiftPgw?.success && shiftPgw.data.length > 0 && user) {
      const shift = shiftPgw.data[0];
      setUser({
        ...user,
        nama_shift: shift?.nama_shift ?? null,
        nama_group: shift?.nama_group ?? null,
      });
    }
  }, [shiftPgw, setUser, user]);

  const [activeIndex, setActiveIndex] = useState(0);
  const config = dashboardTransConfig[kodeTrans];

  // QUERY DATA
  const dashboardParamsConfig: Record<string, () => Record<string, unknown>> = {
    MTR: () => ({
      id_installasi: id_installasi,
      tanggal: now.toISOString().split("T")[0],
      jam_sekarang: new Date().getHours(),
      kode_trans: kodeTrans,
    }),
    "MTR.PLN": () => ({
      id_installasi: id_installasi,
      tanggal: now.toISOString().split("T")[0],
      jam_sekarang: new Date().getHours(),
      kode_trans: kodeTrans,
    }),
    SGAI: () => ({
      id_installasi: id_installasi,
      tanggal: now.toISOString().split("T")[0],
      jam_sekarang: new Date().getHours(),
      kode_trans: kodeTrans,
    }),
    "WTP.DEBT": () => ({
      id_installasi: id_installasi,
      tanggal: now.toISOString().split("T")[0],
      jam_sekarang: new Date().getHours(),
      kode_trans: kodeTrans,
    }),
    RSV: () => ({
      id_installasi: id_installasi,
      tanggal: now.toISOString().split("T")[0],
      jam_sekarang: new Date().getHours(),
      kode_trans: kodeTrans,
    }),
    "POMP.ATM": () => ({
      id_installasi: id_installasi,
      tanggal: now.toISOString().split("T")[0],
      jam_sekarang: new Date().getHours(),
      kode_trans: kodeTrans,
    }),
    "POMP.AMP": () => ({
      tanggal: now.toISOString().split("T")[0],
      kode_trans: kodeTrans,
      id_installasi: id_installasi,
      jam_sekarang: new Date().getHours(),
    }),
    CUCI: () => ({
      tanggal: now.toISOString().split("T")[0],
      kode_trans: kodeTrans,
      id_installasi: id_installasi,
      jam_sekarang: new Date().getHours(),
    }),
    DOSIS: () => ({
      id_installasi: id_installasi,
      tanggal: now.toISOString().split("T")[0],
      jam_sekarang: new Date().getHours(),
      kode_trans: kodeTrans,
    }),
    CPLT: () => ({
      id_installasi: id_installasi,
      tanggal: now.toISOString().split("T")[0],
      jam_sekarang: 10,
    }),
  };

  const params = dashboardParamsConfig[kodeTrans]?.() ?? {};

  const {
    data: KubikasiData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["dashboardQuery", kodeTrans, ...Object.values(params)],
    queryFn: () => config?.fetcher?.(params),
    enabled: !!config,
    // staleTime: 1000 * 60 * 60,
  });

  // end query DATA

  useEffect(() => {
    const clearCacheData = async () => {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
    };

    const interval = setInterval(
      async () => {
        await clearCacheData();
      },
      1000 * 60 * 60 * 24
    );

    return () => clearInterval(interval);
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollX = scrollRef.current.scrollLeft;
    const cardWidth = scrollRef.current.clientWidth;

    const index = Math.round(scrollX / cardWidth);
    setActiveIndex(index);
  };

  const getDashboardKodeNow = useDashboardStore(
    (state) => state.selectedDashboard.value
  );

  const refetchAllData = () => {
    refetch();
    refetchShift();
    refetchProgress();
  };

  const isDosis = getDashboardKodeNow === "DOSIS";
  const isCipolety = getDashboardKodeNow === "CPLT";
  const isCuci = getDashboardKodeNow === "CUCI";
  const isMeter = getDashboardKodeNow === "MTR";
  if (isFetching || isLoading) {
    return <DashboardSkeleton />;
  }
  return (
    <div className="w-full py-2 overflow-auto shadow-none bg-whiteCust rounded-xl overscroll-auto">
      <Header title={<DropdownDashboard />} />
      {kodeTrans === "POMP.AMP" ? (
        <div className="w-full px-4">
          {!isLoading && KubikasiData?.data && (
            <DashboardInfoCardPompa data={KubikasiData.data} />
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-center gap-2 mb-4">
            {!isDosis &&
              KubikasiData?.data?.map((_: any, dotIndex: any) => (
                <div
                  key={dotIndex}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    dotIndex === activeIndex ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              ))}
          </div>

          <div
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
            ref={scrollRef}
            onScroll={handleScroll}
          >
            {KubikasiData?.data?.map((data: any, index: number) => {
              const rowsCuci = [
                {
                  jenis: "sedimen",
                  cuci: Number(data.jumlah_cuci_sedimen),
                  jumlah: Number(data.total_sedimen),
                  bak: data.daftar_bak_sedimen || "-",
                },
                {
                  jenis: "filtrasi",
                  cuci: Number(data.jumlah_cuci_filtrasi),
                  jumlah: Number(data.total_filtrasi),
                  bak: data.daftar_bak_filtrasi || "-",
                },
                {
                  jenis: "flokulator",
                  cuci: Number(data.jumlah_cuci_flokulator),
                  jumlah: Number(data.total_flokulator),
                  bak: data.daftar_bak_flokulator || "-",
                },
              ];

              return (
                <div
                  key={index}
                  className="flex-shrink-0 w-full px-4 snap-start"
                >
                  {isCuci ? (
                    <div className="mb-4">
                      <PencucianInfoCard
                        updateDt={data.update_dt}
                        wtpName={data.nama_wtp}
                        data={rowsCuci}
                      />
                    </div>
                  ) : isDosis ? (
                    <DashboardInfoCardDosis data={KubikasiData?.data ?? []} />
                  ) : isCipolety ? (
                    <div className="pb-4">
                      <DashboardInfoCipolety
                        idWtp={data.id_wtp}
                        tgl={now.toISOString().split("T")[0]}
                        jam={data.jam.split(",").map(Number)}
                        info={data.keterangan}
                        chartData={data.chart.split(",").map(Number)}
                        lokasi={data.nama}
                        literPerDetik={Number(data.total_air_produksi)}
                        satuan={config.satuan}
                        nilaiLd1={Number(data.nilai_ld_1)}
                        nilaiLd2={Number(data.nilai_ld_2)}
                        nilaiTinggi1={Number(data.nilai_tinggi_1)}
                        nilaiTinggi2={Number(data.nilai_tinggi_2)}
                      />
                    </div>
                  ) : isMeter ? (
                    <DashboardInfoMeter
                      idMeter={data.id_meter}
                      tgl={now.toISOString().split("T")[0]}
                      jam={data.jam.split(",").map(Number)}
                      nilaiAwal={Number(data.nilai_awal)}
                      info={data.keterangan}
                      nilaiAkhir={Number(data.nilai_akhir)}
                      chartData={data.chart.split(",").map(Number)}
                      lokasi={data.nama}
                      literPerDetik={Number(data.liter_per_detik)}
                      nilai={Number(data.total)}
                      satuan={config.satuan}
                    />
                  ) : (
                    <DashboardInfoCard
                      jam={data.jam.split(",").map(Number)}
                      nilaiAwal={Number(data.nilai_awal)}
                      info={data.keterangan}
                      nilaiAkhir={Number(data.nilai_akhir)}
                      chartData={data.chart.split(",").map(Number)}
                      lokasi={data.nama}
                      literPerDetik={Number(data.liter_per_detik)}
                      nilai={Number(data.total)}
                      satuan={config.satuan || data.satuan}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
      <div className="px-3">
        <NextInputInfo />
        <DashboardCardReminder
          data={ProgressReminder?.data ?? []}
          isLoading={isLoadingProgressReminder}
        />
        <ShiftPicker time={now} action={refetchAllData} />
      </div>
    </div>
  );
}
