import React, { useEffect, useState } from "react";
import IcTimer from "../assets/ic_timer.svg";
// import { useServerTime } from "../hooks/useServerTime";

interface TimeInfoProps {
  className?: string;
  jam?: number | undefined;
}

const TimeInfo: React.FC<TimeInfoProps> = ({ className = "" }) => {
  const [countdown, setCountdown] = useState("");
  const [nextTime, setNextTime] = useState("");
  // const dateClient = new Date();
  // const dateServer = useServerTime();
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);

      const diff = nextHour.getTime() - now.getTime();
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const formattedCountdown = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;

      const formattedNextTime = nextHour.toTimeString().substring(0, 5); // "HH:MM"

      setCountdown(formattedCountdown);
      setNextTime(formattedNextTime);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`rounded-xl border bg-white shadow-none px-4 py-3 mb-4 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center justify-center gap-2">
          <img src={IcTimer} alt="Timer Icon" className="w-14 h-14" />
          <span className="font-bold text-gray-800 text-md md:text-base">
            Sisa waktu menuju jam berikutnya
          </span>
        </div>
        <div className="text-center">
          <div className="px-2 py-1 font-semibold text-white rounded-md text-md bg-orangeCust md:text-base">
            {nextTime}
          </div>
          <div className="my-1 text-lg font-bold leading-tight text-gray-800">
            {countdown}
          </div>
        </div>
      </div>

      {/* Tambahan: info waktu server & client */}
      {/* <div className="flex justify-between mt-3 text-xs text-gray-600">
        <div className="flex flex-col">
          <strong>Waktu Perangkat :</strong>
          <p>
            {dateClient.toLocaleString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>
        <div className="flex flex-col">
          <strong>Waktu Server :</strong>
          <p>
            {dateServer
              ? new Date(dateServer).toLocaleString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : "-"}
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default TimeInfo;
