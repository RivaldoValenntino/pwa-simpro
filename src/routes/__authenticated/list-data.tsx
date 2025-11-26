import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import TimeInfo from "../../components/time-info";
import { fetchRefJenisQuery } from "../../queries/dashboard/fecth-ref-jenis";
import { SkeletonListJenis } from "../../components/skeleton/skeleton-jenis";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useServerTime } from "../../hooks/useServerTime";
import { useDateGlobal } from "../../store/date";

// Heroicons & Lucide Icons
import {
  BeakerIcon, // heroicons - Kimia
  ChartBarIcon, // heroicons - untuk statistik/debit
  BoltIcon, // heroicons - listrik / genset
  ClockIcon, // heroicons - hours meter
  BuildingOffice2Icon, // heroicons - kantor
} from "@heroicons/react/24/solid";

import {
  Droplet,
  Gauge,
  Battery,
  Waves,
  Factory,
  ClipboardList,
  Ruler,
  PackageCheck,
} from "lucide-react";
import type { JSX } from "react";

export const Route = createFileRoute("/__authenticated/list-data")({
  component: RouteComponent,
});

const iconMap: Record<string, JSX.Element> = {
  "BHN.KMIA": <PackageCheck className="w-10 h-10 text-indigo-500" />,
  CPLT: <Ruler className="w-10 h-10 text-gray-600" />,
  CUCI: <Droplet className="w-10 h-10 text-blue-400" />,
  DOSIS: <ClipboardList className="w-10 h-10 text-green-500" />,
  GNST: <Battery className="w-10 h-10 text-red-500" />,
  KMIA: <BeakerIcon className="w-10 h-10 text-purple-500" />,
  "KWL.UA": <BeakerIcon className="w-10 h-10 text-teal-500" />,
  MTR: <Gauge className="w-10 h-10 text-blue-600" />,
  "MTR.HRS": <ClockIcon className="w-10 h-10 text-orange-500" />,
  "MTR.PLN": <BoltIcon className="w-10 h-10 text-yellow-500" />,
  "PAKAI.KANT": <BuildingOffice2Icon className="w-10 h-10 text-gray-700" />,
  "POMP.AMP": <Gauge className="w-10 h-10 text-red-400" />,
  "POMP.ATM": <Gauge className="w-10 h-10 text-cyan-500" />,
  RSV: <Waves className="w-10 h-10 text-blue-500" />,
  SGAI: <Waves className="w-10 h-10 text-sky-600" />,
  "WTP.DEBT": <Factory className="w-10 h-10 text-emerald-600" />,
};

const specialRoutes: Record<string, string> = {
  SGAI: "detail-sgai",
  MTR: "detail",
  CPLT: "detail-cplt",
  RSV: "detail-rsv",
  "MTR.PLN": "detail-pln",
  "WTP.DEBT": "detail-wtp-debt",
  "POMP.ATM": "detail-pomp-atm",
  "POMP.AMP": "detail-pomp-amp",
  DOSIS: "detail-dosis",
  CUCI: "detail-cuci",
  "KWL.UA": "detail-kwl-ua",
  KMIA: "detail-kimia",
  GNST: "detail-gnst",
  "PAKAI.KANT": "detail-pakai-kntr",
  "MTR.HRS": "detail-mtr-hrs",
};

function RouteComponent() {
  const navigate = useNavigate();
  const time = useServerTime();
  const tanggalGlobal = useDateGlobal((s) => s.tanggal_global);
  const dateNow =
    tanggalGlobal?.toISOString().split("T")[0] ??
    time?.toISOString().split("T")[0];

  const { jam } = useSearch({ strict: false });
  if (!jam) navigate({ to: "/not-found" });
  const { data, isLoading, isFetching } = useQuery(
    fetchRefJenisQuery(Number(jam), dateNow)
  );

  const jenisList = data?.data ?? [];

  const listJenisItems = jenisList
    .filter((item) => item.is_per_jam == "1")
    .map((item) => {
      const isSpecial = item.is_per_jam === "0";

      const progress = isSpecial
        ? `${item.v_total}`
        : item.jumlah_catat || "0/0";

      const percentage = parseFloat(item.persentase_catat || "0");

      let progressColor = "bg-orangeCust/50";
      if (isSpecial) {
        progressColor =
          Number(item.v_total) === 0 ? "bg-gray-400" : "bg-primary";
      } else {
        if (percentage >= 100) progressColor = "bg-primary";
        else if (percentage > 0) progressColor = "bg-orangeCust";
        else if (progress === "0/0") progressColor = "bg-gray-300";
      }

      return {
        title: item.nama,
        kode: item.kode,
        icon: iconMap[item.kode] ?? (
          <ChartBarIcon className="w-10 h-10 text-gray-400" />
        ),
        progress,
        is_per_jam: item.is_per_jam,
        progressColor,
        jenis: item.jenis,
      };
    });

  if (isLoading || isFetching) {
    return <SkeletonListJenis />;
  }

  return (
    <div className="w-full p-4 pb-8 overflow-hidden shadow-none bg-whiteCust rounded-xl">
      <TimeInfo />
      <div
        onClick={() =>
          navigate({
            to: `/pencatatan-harian`,
            search: { jam: jam ?? undefined },
          })
        }
        className="flex flex-col items-center justify-center p-4 mb-4 border-2 rounded-lg shadow-md cursor-pointer bg-gradient-to-b from-blue-50 to-blue-100 border-primary"
      >
        <ChartBarIcon className="w-24 h-24 text-blue-500" />
        <p>Pencatatan Harian</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {listJenisItems.map((item, idx) => {
          const isSpecial = item.is_per_jam === "0";

          return (
            <div
              onClick={() => {
                if (!isSpecial && item.progress === "0/0") {
                  toast.error("Data belum tersedia untuk jenis ini.");
                  return;
                }

                const isMapped = Object.keys(specialRoutes).includes(item.kode);
                if (isMapped) {
                  navigate({
                    to: `/pages/${specialRoutes[item.kode]}/${item.kode}`,
                    search: {
                      jam: jam ?? undefined,
                      type: item.jenis ?? undefined,
                    },
                  });
                } else {
                  navigate({ to: `/coming-soon` });
                }
              }}
              key={idx}
              className={`flex flex-col items-center p-3 text-center rounded-md cursor-pointer bg-white shadow-sm`}
            >
              <div className="flex items-center justify-center w-20 h-20 mb-2 rounded-lg">
                {item.icon}
              </div>

              <div
                className={`text-white text-xs font-semibold px-2 py-1 rounded-full w-full mb-1 mt-2 ${item.progressColor}`}
              >
                {item.progress === "0/0" ? "Tidak Tersedia" : item.progress}
              </div>
              <p className="text-sm font-medium text-gray-800">{item.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RouteComponent;
