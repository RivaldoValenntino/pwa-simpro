import React, { useState } from "react";
import StandMeterInfo from "./stand-meter-info";
import TotalKubicasi from "./total-kubikasi";
import { useDashboardStore } from "../../store/dashboard-store";
import TotalLiterPerDetik from "./total-liter-perdetik";
import ChartMeter from "./chart-meter";
import { fetchDataInfoDashboardMeter } from "../../queries/dashboard/meter/info-dashboard-meter";
import { useAuthStore } from "../../store/auth";
import { useMutation } from "@tanstack/react-query";
import FullScreenSpinner from "../full-screen-spinner";

type DashboardInfoProps = {
  lokasi: string;
  idMeter: number;
  chartData?: number[];
  info?: string;
  nilaiAwal?: number;
  nilaiAkhir?: number;
  nilai?: number;
  jam?: number[] | undefined;
  className?: string;
  titleStart?: string;
  titleEnd?: string;
  tgl?: string;
  titleTotal?: string;
  satuan?: string;
  literPerDetik?: number;
};

const DashboardInfoMeter: React.FC<DashboardInfoProps> = ({
  lokasi,
  chartData,
  idMeter,
  info,
  nilaiAwal,
  nilaiAkhir,
  nilai,
  jam,
  className = "",
  titleStart,
  titleEnd,
  satuan,
  literPerDetik,
  tgl,
}) => {
  const getDashboardKodeNow = useDashboardStore(
    (state) => state.selectedDashboard.value
  );

  // ✅ state buat nampung hasil API
  const [overrideData, setOverrideData] = useState<{
    total?: number;
    liter_per_detik?: number;
    st_awal?: number;
    st_akhir?: number;
  }>({});

  const infoMeterMutation = useMutation({
    mutationFn: (vars: {
      id_installasi: string | undefined;
      tanggal: string | undefined;
      id_meter: number | undefined;
      jam_sekarang: number | undefined;
      kode_trans: string | undefined;
    }) => fetchDataInfoDashboardMeter(vars),
    onSuccess: (res) => {
      if (res.data.length > 0) {
        const d = res.data[0];
        setOverrideData({
          total: Number(d.total),
          liter_per_detik: Number(d.liter_per_detik),
          st_awal: Number(d.st_awal),
          st_akhir: Number(d.st_akhir),
        });
      }
    },
  });

  const handleBarClick = (hour: number, tgl: string | undefined) => {
    infoMeterMutation.mutate({
      id_installasi: useAuthStore.getState().user?.id_installasi,
      tanggal: tgl,
      id_meter: idMeter,
      jam_sekarang: hour,
      kode_trans: getDashboardKodeNow,
    });
  };

  const displayTotal = overrideData.total ?? nilai ?? 0;
  const displayLiterPerDetik =
    overrideData.liter_per_detik ?? literPerDetik ?? 0;
  const displayAwal = overrideData.st_awal ?? nilaiAwal ?? 0;
  const displayAkhir = overrideData.st_akhir ?? nilaiAkhir ?? 0;
  return (
    <div className={`${className}`}>
      {infoMeterMutation.isPending && <FullScreenSpinner />}
      <ChartMeter
        onBarClick={handleBarClick}
        tgl={tgl}
        jam={jam}
        data={chartData || [100, 100, 100]}
        lokasi={lokasi}
        chartInfo={info || ""}
      />

      <div className="grid items-stretch grid-cols-12 gap-4 py-4 mt-4">
        <div className="col-span-12 xs:col-span-8">
          <StandMeterInfo
            awal={displayAwal || 0}
            akhir={displayAkhir || 0}
            titleStart={titleStart || ""}
            titleEnd={titleEnd || ""}
          />
        </div>

        <div className="col-span-12 xs:col-span-4">
          <TotalKubicasi value={displayTotal || 0} satuan={satuan} />
        </div>
        {getDashboardKodeNow === "MTR" && (
          <div className="col-span-12">
            <TotalLiterPerDetik
              value={displayLiterPerDetik || 0}
              satuan={satuan}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardInfoMeter;
