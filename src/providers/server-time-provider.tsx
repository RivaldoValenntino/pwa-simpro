import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../libs/api";

const ServerTimeContext = createContext<Date | null>(null);

export const ServerTimeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [serverTime, setServerTime] = useState<Date | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    api
      .get("/mobile/fetch-time")
      .then((res) => {
        const baseTime = new Date(res.data.iso);
        setServerTime(baseTime);

        timer = setInterval(() => {
          setServerTime((prev) =>
            prev ? new Date(prev.getTime() + 1000) : null
          );
        }, 1000);
      })
      .catch((err) => {
        console.error("Gagal ambil waktu server:", err);
      });

    return () => clearInterval(timer);
  }, []);

  return (
    <ServerTimeContext.Provider value={serverTime}>
      {children}
    </ServerTimeContext.Provider>
  );
};

export const useServerTime = () => useContext(ServerTimeContext);
