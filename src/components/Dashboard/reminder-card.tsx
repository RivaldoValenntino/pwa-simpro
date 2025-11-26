import React from "react";

interface ReminderCardProps {
  title: string;
  progress: number;
  remaining: string;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  title,
  progress,
  remaining,
}) => {
  let status = "Belum selesai";
  if (progress === 100) status = "Selesai";
  else if (progress >= 70) status = "Dalam Proses";

  return (
    <div className="bg-white rounded-2xl shadow-md border p-4 flex flex-col justify-between hover:shadow-lg transition">
      {/* Title & Badge */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            progress === 100
              ? "bg-green-100 text-green-700"
              : progress >= 70
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full bg-blue-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <p className="text-xs text-gray-500 mt-2 font-bold">{remaining}</p>
        <p className="text-xs text-gray-500 mt-2 font-bold">
          {progress}% selesai
        </p>
      </div>
    </div>
  );
};

export default ReminderCard;
