import {
  BriefcaseIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { useServerTime } from "../hooks/useServerTime";
import { BeakerIcon } from "@heroicons/react/20/solid";

type ShiftInfoProps = {
  shift: string | null | undefined;
  tanggal: string;
  group?: string | null | undefined;
};

const ShiftInfo: React.FC<ShiftInfoProps> = ({ shift, tanggal, group }) => {
  const now = useServerTime();

  const jamSekarang = now
    ? `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
    : "--:--:--";

  const redirectToWeb = () => {
    window.open(
      "https://produksi-panel.kahuripan.erpsystempdam.com/produksi/public/kahuripan/auth/login",
      "_blank"
    );
  };
  return (
    <div className="flex flex-col w-full gap-2 px-1 py-2 font-medium text-white md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="flex items-center justify-between space-x-2">
          <span className="text-sm flex gap-2">
            <BriefcaseIcon className="w-5 h-5" />
            Shift:{" "}
            <span className="font-bold">
              {shift || "-"} ({group || "-"})
            </span>
          </span>
          <button
            className="flex items-center space-x-1 bg-[#003ECF] text-white text-xs font-semibold px-3 py-1 rounded-full"
            onClick={redirectToWeb}
          >
            <BeakerIcon className="w-5 h-5" />
            <span className="text-sm">Form BA</span>
          </button>
        </div>

        <span className="hidden text-white sm:block">|</span>

        <div className="flex items-center space-x-2">
          <ClipboardDocumentListIcon className="w-5 h-5" />
          <p className="text-sm">
            Sudah input: <span className="font-bold">{tanggal}</span>
          </p>
          <p className="px-2 py-1 text-sm font-bold text-center text-white rounded-full bg-orangeCust w-fit">
            {jamSekarang}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShiftInfo;
