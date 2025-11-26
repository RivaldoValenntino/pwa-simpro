import React from "react";
import Chart from "./chart";
import StandMeterInfo from "./stand-meter-info";
import TotalKubicasi from "./total-kubikasi";
import TotalKwhCard from "./total-kwh";
import { useDashboardStore } from "../../store/dashboard-store";
import TotalLiterPerDetik from "./total-liter-perdetik";

type DashboardInfoProps = {
  lokasi: string;
  chartData?: number[];
  info?: string;
  nilaiAwal?: number;
  nilaiAkhir?: number;
  nilai?: number;
  jam?: number[] | undefined;
  className?: string;
  titleStart?: string;
  titleEnd?: string;
  titleTotal?: string;
  satuan?: string;
  literPerDetik?: number;
};

const DashboardInfoCard: React.FC<DashboardInfoProps> = ({
  lokasi,
  chartData,
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
}) => {
  const getDashboardKodeNow = useDashboardStore(
    (state) => state.selectedDashboard.value
  );

  return (
    <div className={`${className}`}>
      <Chart
        jam={jam}
        data={chartData || [100, 100, 100]}
        lokasi={lokasi}
        chartInfo={info || ""}
      />

      <div className="grid items-stretch grid-cols-12 gap-4 py-4 mt-4">
        <div className="col-span-12 xs:col-span-8">
          <StandMeterInfo
            awal={nilaiAwal || 0}
            akhir={nilaiAkhir || 0}
            titleStart={titleStart || ""}
            titleEnd={titleEnd || ""}
            satuan={satuan || ""}
          />
        </div>

        <div className="col-span-12 xs:col-span-4">
          {getDashboardKodeNow === "MTR.PLN" ? (
            <TotalKwhCard value={nilai || 0} jenis={lokasi} />
          ) : (
            <>
              <TotalKubicasi value={nilai || 0} satuan={satuan} />
            </>
          )}
        </div>
        {getDashboardKodeNow === "MTR" && (
          <div className="col-span-12">
            <TotalLiterPerDetik value={literPerDetik || 0} satuan={satuan} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardInfoCard;
