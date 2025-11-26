import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth";
import FullScreenSpinner from "../full-screen-spinner";
import TotalLiterPerDetik from "./total-liter-perdetik";
import StandMeterInfo from "./stand-meter-info";
import ChartCipolety from "./chart-cipolety";
import { fetchDataInfoDashboardCipolety } from "../../queries/dashboard/cipolety/fetch-info-dashboard-cipolety";

type DashboardInfoProps = {
  lokasi: string;
  idWtp: number;
  info: string;
  chartData?: number[];
  jam?: number[] | undefined;
  className?: string;
  tgl?: string;
  satuan?: string;
  literPerDetik?: number;
  nilaiTinggi1?: number;
  nilaiTinggi2?: number;
  nilaiLd1?: number;
  nilaiLd2?: number;
};

const DashboardInfoCipolety: React.FC<DashboardInfoProps> = ({
  lokasi,
  chartData,
  idWtp,
  jam,
  className = "",
  info,
  satuan,
  literPerDetik,
  tgl,
  nilaiTinggi1,
  nilaiTinggi2,
  nilaiLd1,
  nilaiLd2,
}) => {
  // ✅ state buat nampung hasil API
  const [overrideData, setOverrideData] = useState<{
    total_air_produksi?: number;
    nilai_tinggi_1?: number;
    nilai_tinggi_2?: number;
    nilai_ld_1?: number;
    nilai_ld_2?: number;
  }>({});

  const infoCipoletyMutation = useMutation({
    mutationFn: (vars: {
      id_installasi: string | undefined;
      tanggal: string | undefined;
      id_wtp: number | undefined;
      jam_sekarang: number | undefined;
    }) => fetchDataInfoDashboardCipolety(vars),
    onSuccess: (res) => {
      if (res.data.length > 0) {
        const d = res.data[0];
        setOverrideData({
          total_air_produksi: Number(d.total_air_produksi),
          nilai_tinggi_1: Number(d.nilai_tinggi_1),
          nilai_tinggi_2: Number(d.nilai_tinggi_2),
          nilai_ld_1: Number(d.nilai_ld_1),
          nilai_ld_2: Number(d.nilai_ld_2),
        });
      }
    },
  });

  const handleBarClick = (hour: number, tgl: string | undefined) => {
    infoCipoletyMutation.mutate({
      id_installasi: useAuthStore.getState().user?.id_installasi,
      tanggal: tgl,
      id_wtp: idWtp,
      jam_sekarang: hour,
    });
  };

  // const displayTotal = overrideData.total ?? nilai ?? 0;
  const displayLiterPerDetik =
    overrideData.total_air_produksi ?? literPerDetik ?? 0;
  const displayAwalTinggi1 = overrideData.nilai_tinggi_1 ?? nilaiTinggi1 ?? 0;
  const displayAwalTinggi2 = overrideData.nilai_tinggi_2 ?? nilaiTinggi2 ?? 0;
  const displayAwalLd1 = overrideData.nilai_ld_1 ?? nilaiLd1 ?? 0;
  const displayAwalLd2 = overrideData.nilai_ld_2 ?? nilaiLd2 ?? 0;
  return (
    <div className={`${className}`}>
      {infoCipoletyMutation.isPending && <FullScreenSpinner />}
      <ChartCipolety
        onBarClick={handleBarClick}
        tgl={tgl}
        jam={jam}
        data={chartData || [100, 100, 100]}
        lokasi={lokasi}
        chartInfo={info || ""}
      />

      <div className="grid items-stretch grid-cols-12 gap-4 py-4 mt-4">
        {/* Stand Meter Info Tinggi */}
        <div className="col-span-12 md:col-span-6">
          <StandMeterInfo
            awal={displayAwalTinggi1 || 0}
            akhir={displayAwalTinggi2 || 0}
            titleStart={"Update Tinggi Cipolety 1"}
            titleEnd={"Update Tinggi Cipolety 2"}
          />
        </div>

        {/* Stand Meter Info L/D */}
        <div className="col-span-12 md:col-span-6">
          <StandMeterInfo
            awal={displayAwalLd1 || 0}
            akhir={displayAwalLd2 || 0}
            titleStart={"Update L/D Cipolety 1"}
            titleEnd={"Update L/D Cipolety 2"}
          />
        </div>

        {/* Total Liter Per Detik */}
        <div className="col-span-12">
          <TotalLiterPerDetik
            value={displayLiterPerDetik || 0}
            satuan={satuan}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardInfoCipolety;
