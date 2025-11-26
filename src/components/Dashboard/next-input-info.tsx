import { useEffect, useState } from "react";
import {
  formatIndoDate,
  getCountdownToNextHour,
  getNextHourDate,
} from "../../utils/date-helper";
import { useServerTime } from "../../hooks/useServerTime";

const NextInputInfo = () => {
  const serverTime = useServerTime(); // ambil waktu dari server
  const [countdown, setCountdown] = useState("");
  const [nextInputTime, setNextInputTime] = useState("");

  useEffect(() => {
    if (!serverTime) return; // kalau waktu server belum ada, jangan jalanin

    const update = () => {
      const current = new Date(serverTime); // clone supaya aman
      const next = getNextHourDate(current);

      setNextInputTime(formatIndoDate(next));
      setCountdown(getCountdownToNextHour(current));
    };

    update();

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [serverTime]);

  return (
    <div className="grid grid-cols-12 mt-4 overflow-hidden text-sm text-white rounded-lg shadow-md">
      <div className="col-span-7 p-3 bg-primary">
        <p>Input Selanjutnya</p>
        <p className="font-semibold">{nextInputTime || "--:--"}</p>
      </div>

      <div className="col-span-5 p-3 text-sm text-right bg-secondary">
        <p>Dalam</p>
        <p className="font-bold">{countdown || "--:--"} Menit</p>
      </div>
    </div>
  );
};

export default NextInputInfo;
