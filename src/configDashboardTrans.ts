import IcMeter from "./assets/meter.svg";
import IcSungai from "./assets/ic_level_sungai.svg";
import IcPompa from "./assets/ic_pompa_atm.svg";
import IcCipolety from "./assets/ic_cipolety.svg";
import { fetchDataChartKubikasiMeter } from "./queries/dashboard/meter/fetch-kubikasi-meter";
import { fetchDataSungaiDashboard } from "./queries/dashboard/sungai/fetch-dashboard-sungai";
import { fetchDataWtpDebtDashboard } from "./queries/dashboard/wtp-debt/fetch-wtp-debt-chart";
import { fetchDataPompAtmDashboard } from "./queries/dashboard/pomp-atm/fetch-pomp-atm-chart";
import { fetchDataChartPompAmp } from "./queries/dashboard/pomp-amp/fecth-nilai-ampere-perjam";
import { fetchDataDosisDashboard } from "./queries/dashboard/dosis/fetch-info-dosis";
import { fetchDataMeterPlnChart } from "./queries/dashboard/meter-pln/fetch-chart-pln";
import { fetchDataChartCipolety } from "./queries/dashboard/cipolety/fetch-cipolety-chart";
import { fetchDataInfoPencucianDashboard } from "./queries/dashboard/pencucian/fetch-info-cuci";
import { fetchRsvChartData } from "./queries/dashboard/reservoar/fetch-rsv-chart";

export const dashboardTransConfig: Record<
  string,
  {
    icon: string;
    endpoint: string;
    labelAwal: string;
    labelAkhir: string;
    totalLabel: string;
    satuan: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetcher: (params: Record<string, any>) => Promise<any>;
  }
> = {
  CPLT: {
    endpoint: "/mobile/dashboard/cipolety/chart-cipolety",
    labelAwal: "",
    satuan: "L/D",
    icon: IcCipolety,
    labelAkhir: "",
    totalLabel: "Produksi",
    fetcher: ({ id_installasi, tanggal, jam_sekarang }) =>
      fetchDataChartCipolety({
        id_installasi,
        tanggal,
        jam_sekarang,
      }),
  },
  MTR: {
    icon: IcMeter,
    endpoint: "/mobile/dashboard/meter/chart-meter",
    labelAwal: "Update Stand Meter Awal",
    satuan: "m³",
    labelAkhir: "Update Stand Meter Akhir",
    totalLabel: "Kubikasi",
    fetcher: ({ id_installasi, tanggal, jam_sekarang, kode_trans }) =>
      fetchDataChartKubikasiMeter({
        id_installasi,
        tanggal,
        jam_sekarang,
        kode_trans,
      }),
  },
  "MTR.PLN": {
    icon: IcMeter,
    endpoint: "/mobile/dashboard/meter-pln/chart-meter-pln",
    labelAwal: "Update Stand Awal",
    satuan: "",
    labelAkhir: "Update Stand Akhir",
    totalLabel: "kWh",
    fetcher: ({ id_installasi, tanggal, jam_sekarang, kode_trans }) =>
      fetchDataMeterPlnChart({
        id_installasi,
        tanggal,
        jam_sekarang,
        kode_trans,
      }),
  },
  SGAI: {
    icon: IcSungai,
    endpoint: "/mobile/dashboard/sungai/chart-sungai",
    labelAwal: "Ketinggian Air Sebelumnya",
    satuan: "cm",
    labelAkhir: "Ketinggian Air Saat Ini",
    totalLabel: "Selisih Kenaikan",
    fetcher: ({ id_installasi, tanggal, jam_sekarang, kode_trans }) =>
      fetchDataSungaiDashboard({
        id_installasi,
        tanggal,
        jam_sekarang,
        kode_trans,
      }),
  },
  "WTP.DEBT": {
    icon: IcSungai,
    endpoint: "/mobile/dashboard/wtp-debt/chart-wtp-debt",
    labelAwal: "Debit WTP Sebelumnya",
    satuan: "l/d",
    labelAkhir: "Debit WTP Saat Ini",
    totalLabel: "Selisih Kenaikan",
    fetcher: ({ id_installasi, tanggal, jam_sekarang, kode_trans }) =>
      fetchDataWtpDebtDashboard({
        id_installasi,
        tanggal,
        jam_sekarang,
        kode_trans,
      }),
  },
  RSV: {
    icon: IcSungai,
    endpoint: "/mobile/dashboard/rsv/chart-rsv",
    labelAwal: "Level Air Sebelumnya",
    satuan: "cm",
    labelAkhir: "Level Air Saat Ini",
    totalLabel: "Selisih Kenaikan",
    fetcher: ({ id_installasi, tanggal, jam_sekarang, kode_trans }) =>
      fetchRsvChartData({
        id_installasi,
        tanggal,
        jam_sekarang,
        kode_trans,
      }),
  },
  "POMP.ATM": {
    icon: IcPompa,
    endpoint: "/mobile/dashboard/pomp-atm/chart-pomp-atm",
    labelAwal: "Nilai ATM Sebelumnya",
    satuan: "Pa",
    labelAkhir: "Nilai ATM Saat Ini",
    totalLabel: "Selisih",
    fetcher: ({ id_installasi, tanggal, jam_sekarang, kode_trans }) =>
      fetchDataPompAtmDashboard({
        id_installasi,
        tanggal,
        jam_sekarang,
        kode_trans,
      }),
  },
  "POMP.AMP": {
    icon: "",
    endpoint: "/mobile/dashboard/pomp-amp/chart-pomp-amp",
    labelAwal: "",
    satuan: "",
    labelAkhir: "",
    totalLabel: "",
    fetcher: ({ tanggal, kode_trans, id_installasi, jam_sekarang }) =>
      fetchDataChartPompAmp({
        tanggal,
        kode_trans,
        id_installasi,
        jam_sekarang,
      }),
  },
  DOSIS: {
    icon: "",
    endpoint: "/mobile/dashboard/dosis/chart-dosis",
    labelAwal: "",
    satuan: "",
    labelAkhir: "",
    totalLabel: "",
    fetcher: ({ tanggal, kode_trans, id_installasi, jam_sekarang }) =>
      fetchDataDosisDashboard({
        tanggal,
        kode_trans,
        id_installasi,
        jam_sekarang,
      }),
  },
  CUCI: {
    icon: "",
    endpoint: "/mobile/dashboard/pencucian/chart-pencucian",
    labelAwal: "",
    satuan: "",
    labelAkhir: "",
    totalLabel: "",
    fetcher: ({ tanggal, kode_trans, id_installasi, jam_sekarang }) =>
      fetchDataInfoPencucianDashboard({
        tanggal,
        kode_trans,
        id_installasi,
        jam_sekarang,
      }),
  },
};
