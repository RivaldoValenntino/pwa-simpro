import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useServerTime } from "../../hooks/useServerTime";
import { useDateGlobal } from "../../store/date";
import { fetchRefJenisQuery } from "../../queries/dashboard/fecth-ref-jenis";
import { useQuery } from "@tanstack/react-query";
import TimeInfo from "../../components/time-info";
import NoImage from "../../assets/images/no-image-removebg-preview.png";
import toast from "react-hot-toast";
import BackButton from "../../components/back-button";
import { FlaskConical, Cog, Timer, Building2, Bubbles } from "lucide-react";
import CardGridSkeleton from "../../components/skeleton/card-grid-skeleton";
export const Route = createFileRoute("/__authenticated/pencatatan-harian")({
  component: RouteComponent,
});

// Mapping kode → icon component
const imageMap: Record<string, React.ElementType> = {
  DOSIS: FlaskConical,
  CUCI: Bubbles, //  Pencucian
  "MTR.HRS": Timer, //  Hours Meter Pompa
  "BHN.KMIA": FlaskConical, //  Penggunaan Bahan & Kimia
  GNST: Cog, //  Genset
  "PAKAI.KANT": Building2, //  Pemakaian Kantor
};

// const imageMap: Record<string, string> = {
//   MTR: IcWm,
//   RSV: IcReservoar,
//   CPLT: IcCipolety,
//   AMPD: IcAmpere,
//   SGAI: IcSungai,
//   "MTR.PLN": IcPln,
//   "POMP.ATM": IcPompa,
//   "WTP.DEBT": IcWm,
//   "POMP.AMP": IcAmpere,
//   DOSIS: IcDosis,
//   CUCI: IcCuci,
//   "MTR.HRS": IcAmpere,
// };

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
    .filter((item) => item.is_per_jam == "0") // Filter hanya yang is_per_jam = "0"
    .map((item) => {
      const progress = `${item.v_total}`; // langsung tampil totalnya saja
      // const percentage = parseFloat(item.persentase_catat || "0");

      let progressColor = "bg-orangeCust/50";
      if (Number(item.v_total) === 0) progressColor = "bg-gray-400";
      else progressColor = "bg-primary";

      return {
        title: item.nama,
        kode: item.kode,
        image: NoImage,
        // image: imageMap[item.kode] ?? "",
        progress,
        is_per_jam: item.is_per_jam,
        progressColor,
        jenis: item.jenis,
      };
    });

  if (isLoading || isFetching) {
    return (
      <div className="w-full p-4 overflow-hidden shadow-none bg-whiteCust rounded-xl">
        <CardGridSkeleton />;
      </div>
    );
  }

  return (
    <div className="w-full p-4 pb-8 overflow-hidden shadow-none bg-whiteCust rounded-xl">
      <BackButton to={`/list-data/`} search={{ jam }} />
      <TimeInfo />
      <div className="grid grid-cols-1 gap-3">
        {listJenisItems.map((item, idx) => {
          const isSpecial = item.is_per_jam;
          return (
            <div
              onClick={() => {
                if (item.progress === "0/0") {
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
              className={`flex flex-col items-center p-3 text-center rounded-md cursor-pointer
  ${isSpecial ? "bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-primary shadow-md" : "bg-white shadow-sm"}
`}
            >
              <div className="flex items-center justify-center w-20 h-20 mb-2 rounded-lg">
                {(() => {
                  const Icon = imageMap[item.kode];
                  return Icon ? (
                    <Icon className="w-12 h-12 text-primary" />
                  ) : (
                    <img
                      src={NoImage}
                      alt={item.title}
                      onError={(e) => (e.currentTarget.src = NoImage)}
                      className="object-contain w-16 h-16"
                    />
                  );
                })()}
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
