import { useDashboardStore } from "../../store/dashboard-store";
import { dashboardTransConfig } from "../../configDashboardTrans";
type Props = {
  awal: number;
  akhir: number;
  titleStart: string;
  titleEnd: string;
  satuan?: string;
};

const StandMeterInfo = ({
  awal,
  akhir,
  titleStart,
  titleEnd,
  satuan = "",
}: Props) => {
  const kodeTrans = useDashboardStore.getState().selectedDashboard.value;
  const config = dashboardTransConfig[kodeTrans];

  if (!config) return null; // Unknown kodeTrans

  return (
    <div className="bg-[#CEDAFF] rounded-xl px-4 py-3 flex items-center space-x-4 w-full h-full shadow-md gap-4">
      <div className="flex-shrink-0 ml-4">
        <img src={config.icon} alt="Meter Icon" className="w-18 h-18" />
      </div>

      <div className="flex flex-col w-full space-y-1">
        <div>
          <p className="text-xs text-white bg-[#2563eb] p-1.5 rounded-md w-fit font-medium">
            {config.labelAwal != "" ? config.labelAwal : titleStart}
          </p>
          <p className="mt-1 text-xl font-semibold text-gray-500">
            {awal.toLocaleString()} {satuan}
          </p>
        </div>

        <div>
          <p className="text-xs text-white bg-[#f97316] p-1.5 rounded-md w-fit font-medium">
            {config.labelAkhir != "" ? config.labelAwal : titleEnd}
          </p>
          <p className="mt-1 text-xl font-bold text-black">
            {akhir.toLocaleString()} {satuan}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StandMeterInfo;
