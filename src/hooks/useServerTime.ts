import { useEffect, useState } from "react";
import { api } from "../libs/api";
import { getShiftDate } from "../utils/date-helper";

export function useServerTime() {
  const [serverTime, setServerTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let current: Date;

    api
      .get("/mobile/fetch-time")
      .then((res) => {
        current = new Date(res.data.iso); 
        setServerTime(getShiftDate(current));

        interval = setInterval(() => {
          current = new Date(current.getTime() + 1000);
          setServerTime(getShiftDate(current));
        }, 1000);
      })
      .catch((err) => {
        console.error("Gagal ambil waktu server:", err);
      });

    return () => clearInterval(interval);
  }, []);

  return serverTime;
}
