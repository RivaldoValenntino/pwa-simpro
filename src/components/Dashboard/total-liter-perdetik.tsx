import IcPipe from "../../assets/pipe.svg";
import { dashboardTransConfig } from "../../configDashboardTrans";
import { useDashboardStore } from "../../store/dashboard-store";

const TotalLiterPerDetik = ({
  value,
}: {
  value: number;
  satuan: string | undefined;
}) => {
  const kodeTrans = useDashboardStore.getState().selectedDashboard.value;
  const config = dashboardTransConfig[kodeTrans];

  if (!config) return null; // Unknown kodeTrans

  return (
    <div className="w-full h-full overflow-hidden shadow-md rounded-xl">
      {/* Header */}
      <div className="bg-[#2563eb] text-white flex justify-between items-start p-4 relative rounded-t-xl">
        <p className="font-medium leading-4 text-md">
          Total
          <br />
          Liter Per Detik
        </p>
        <img
          src={IcPipe}
          alt="Pipe Icon"
          className="absolute bottom-0 right-0 w-12 h-12 opacity-50"
        />
      </div>

      {/* Value Section */}
      <div className="bg-[#CAE2F9] p-6 flex flex-col justify-center items-center text-center rounded-b-xl">
        <div className="flex items-baseline space-x-1">
          <p className="text-3xl font-bold sm:text-4xl">
            {typeof value === "number"
              ? value.toFixed(2).replace(/[.,]00$/, "")
              : value}
          </p>
          <span className="text-sm font-medium sm:text-base">{`l/d`}</span>
        </div>
      </div>
    </div>
  );
};

export default TotalLiterPerDetik;
