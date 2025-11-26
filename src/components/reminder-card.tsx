import React, { type JSX } from "react";
import { CheckCircle, AlertTriangle, CalendarDays } from "lucide-react";
import { formatTanggalIndo } from "../utils/date-helper";

type Status = "danger" | "warning" | "success";

interface ReminderCardProps {
  title: string;
  status: Status;
  endDate?: string;
  remainingDays?: string;
}

const statusStyles: Record<
  Status,
  {
    label: string;
    bg: string;
    bgBadge: string;
    text: string;
    border: string;
    icon: JSX.Element;
  }
> = {
  danger: {
    label: "Belum dialokasikan",
    bg: "bg-red-100",
    bgBadge: "bg-red-200",
    text: "text-red-700",
    border: "border-red-200",
    icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
  },
  warning: {
    label: `Berakhir Dalam 0 Hari`,
    bg: "bg-yellow-100",
    bgBadge: "bg-yellow-200",
    text: "text-yellow-700",
    border: "border-yellow-200",
    icon: <CalendarDays className="w-4 h-4 text-yellow-600" />,
  },
  success: {
    label: "Aman",
    bg: "bg-green-100",
    bgBadge: "bg-green-200",
    text: "text-green-700",
    border: "border-green-200",
    icon: <CheckCircle className="w-4 h-4 text-green-600" />,
  },
};

export const ReminderCard: React.FC<ReminderCardProps> = ({
  title,
  status,
  endDate,
  remainingDays,
}) => {
  const s = statusStyles[status];
  const label =
    status === "warning" && remainingDays
      ? `Berakhir dalam ${remainingDays} Hari`
      : s.label;

  return (
    <div
      className={`w-full rounded-lg border ${s.border} ${s.bg} px-3 py-4 shadow-sm mb-4`}
    >
      {/* Status */}
      <div className="flex items-center mb-2">
        <span
          className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded ${s.bgBadge} ${s.text}`}
        >
          {s.icon}
          {label}
        </span>
      </div>
      {/* Title */}
      <h2 className="mb-2 font-semibold text-md">{title}</h2>
      {/* Detail */}
      <div className="space-y-1 text-sm text-gray-700">
        {endDate && (
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">Tanggal Berakhir</p>
            <p className="text-xs">
              {endDate !== "-" ? formatTanggalIndo(endDate) : "-"}
            </p>
          </div>
        )}
        {remainingDays && (
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">Sisa Hari</p>
            <p className="text-xs">{remainingDays}</p>
          </div>
        )}
      </div>
      {/* Note
      <p className="p-2 mt-3 text-xs text-gray-500 rounded bg-white/60">
        Tampilan baca saja. Pengaturan alokasi hanya dapat dilakukan oleh
        Admin/Kepala Unit di web.
      </p> */}
    </div>
  );
};
