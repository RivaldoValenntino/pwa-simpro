import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import RefreshButton from "./ui/refresh-button";
import { useAuthStore } from "../store/auth";
import toast from "react-hot-toast";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useDateGlobal } from "../store/date";
import { useServerTime } from "../hooks/useServerTime";

type ShiftPickerProps = {
  time: Date;
  action: () => void;
};

const ShiftPicker: React.FC<ShiftPickerProps> = ({ action }) => {
  const navigate = useNavigate();
  const time = useServerTime();
  const hoursServer = time?.getHours() ?? 0;
  const minutesServer = time?.getMinutes() ?? 0;
  const shiftUser = useAuthStore().user?.nama_shift;
  const isPengawas = useAuthStore().user?.is_pengawas;
  const [isMorningShift, setIsMorningShift] = useState(true);
  // Tentukan jam mulai shift berikutnya
  const nextShiftHour = isMorningShift ? 20 : 8;
  // Cek apakah udah 10 menit sebelum shift berikutnya
  const shouldShowNextShiftButton =
    hoursServer === (nextShiftHour === 8 ? 7 : 19) && minutesServer >= 50;
  const setTanggalGlobal = useDateGlobal((s) => s.setTanggalGlobal);
  useEffect(() => {
    setIsMorningShift(hoursServer >= 8 && hoursServer <= 19);
  }, [hoursServer]);

  const clearCacheData = async () => {
    try {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
      action();
      console.log("Cache cleared");
    } catch (err) {
      console.error("Gagal clear cache", err);
    }
  };

  const allTimeSlots = [
    { time: "08:00", val: 8 },
    { time: "09:00", val: 9 },
    { time: "10:00", val: 10 },
    { time: "11:00", val: 11 },
    { time: "12:00", val: 12 },
    { time: "13:00", val: 13 },
    { time: "14:00", val: 14 },
    { time: "15:00", val: 15 },
    { time: "16:00", val: 16 },
    { time: "17:00", val: 17 },
    { time: "18:00", val: 18 },
    { time: "19:00", val: 19 },
    { time: "20:00", val: 20 },
    { time: "21:00", val: 21 },
    { time: "22:00", val: 22 },
    { time: "23:00", val: 23 },
    { time: "00:00", val: 24 },
    { time: "01:00", val: 1 },
    { time: "02:00", val: 2 },
    { time: "03:00", val: 3 },
    { time: "04:00", val: 4 },
    { time: "05:00", val: 5 },
    { time: "06:00", val: 6 },
    { time: "07:00", val: 7 },
  ];

  const filteredSlots = isMorningShift
    ? allTimeSlots.filter((slot) => slot.val >= 8 && slot.val <= 19)
    : allTimeSlots.filter((slot) => slot.val >= 20 || slot.val <= 7);

  return (
    <div className="flex items-center justify-center">
      <div className="w-full p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">
            {isMorningShift ? "Shift Pagi" : "Shift Malam"}
          </h2>

          <div className="flex items-center gap-2">
            {isPengawas === 0 && <RefreshButton onClick={clearCacheData} />}
            {isPengawas === 1 && (
              <button
                type="button"
                onClick={() => setIsMorningShift((prev) => !prev)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                {isMorningShift ? (
                  <>
                    Shift Malam <ChevronRightIcon className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <ChevronLeftIcon className="w-4 h-4" /> Shift Pagi
                  </>
                )}
              </button>
            )}

            {shouldShowNextShiftButton && isPengawas === 0 && (
              <button
                type="button"
                onClick={() => {
                  if (isPengawas === 0 && !shiftUser) {
                    toast.error(
                      "Anda belum memiliki jadwal shift, hubungi admin!"
                    );
                    return;
                  }
                  navigate({ to: `/list-data/${nextShiftHour}` });
                }}
                className="px-3 py-1 text-sm font-semibold text-white shadow-sm rounded-xl bg-greenCust"
              >
                {String(nextShiftHour).padStart(2, "0")}:00
              </button>
            )}
          </div>
        </div>

        <div className="mb-4 border-b border-gray-300" />

        <div className="grid grid-cols-4 gap-4">
          {filteredSlots.map(({ time, val }) => {
            let hourAdjusted = hoursServer === 0 ? 24 : hoursServer;
            const minutesNow = new Date().getMinutes();

            let allowedSlots: number[] = [];

            if (isMorningShift) {
              allowedSlots = filteredSlots
                .map((slot) => slot.val)
                .filter((h) => h <= hourAdjusted);
            } else {
              if (hourAdjusted >= 20) {
                allowedSlots = filteredSlots
                  .map((slot) => slot.val)
                  .filter((h) => h <= hourAdjusted && h >= 20);
              } else {
                allowedSlots = filteredSlots
                  .map((slot) => slot.val)
                  .filter((h) => h >= 20 || h <= hourAdjusted);
              }
            }

            if (minutesNow >= 50) {
              let nextHour = (hourAdjusted + 1) % 24;
              if (nextHour === 0) nextHour = 24;
              if (hourAdjusted === 0) hourAdjusted = 24;
              allowedSlots.push(nextHour);
            }

            const isActive = allowedSlots.includes(val);

            const bgColor = isActive
              ? val === hourAdjusted
                ? "bg-orangeCust text-white"
                : "bg-greenCust text-white"
              : "bg-gray-200 text-gray-400";

            // === VALIDASI SHIFT PEGAWAI ===
            const namaShift = shiftUser;
            const isShiftP = namaShift === "Pagi";
            const isShiftM = namaShift === "Malam";

            const isWaktuShiftP =
              (hoursServer > 7 || (hoursServer === 7 && minutesServer >= 50)) &&
              (hoursServer < 20 || (hoursServer === 19 && minutesServer <= 59));

            const isWaktuShiftM =
              hoursServer > 19 ||
              (hoursServer === 19 && minutesServer >= 50) ||
              hoursServer < 8 ||
              (hoursServer === 7 && minutesServer <= 50);

            const shiftMismatch =
              (isShiftP && !isWaktuShiftP) || (isShiftM && !isWaktuShiftM);
            // ==============================

            return (
              <button
                type="button"
                key={time}
                onClick={() => {
                  if (isPengawas === 0 && !shiftUser) {
                    toast.error(
                      "Anda belum memiliki jadwal shift, hubungi admin!"
                    );
                    return;
                  }

                  // Cegah pegawai klik di luar jam shift-nya
                  if (isPengawas === 0 && shiftMismatch) {
                    toast.error("Anda tidak sedang dalam jam shift Anda!");
                    return;
                  }

                  if (isActive) {
                    let tanggalFinal = new Date();

                    // Kalau klik jam malam (20–07) tapi server masih pagi → tanggal -1
                    if (
                      (val >= 20 || val <= 7) &&
                      hoursServer >= 8 &&
                      hoursServer <= 19 &&
                      minutesServer <= 50
                    ) {
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      tanggalFinal = yesterday;
                      setTanggalGlobal(tanggalFinal);
                    } else {
                      setTanggalGlobal(null);
                    }

                    navigate({ to: `/list-data/${val}` });
                  }
                }}
                disabled={!isActive || (isPengawas === 0 && shiftMismatch)}
                className={`rounded-xl py-2 text-sm font-semibold shadow-sm ${bgColor} transition duration-200 disabled:cursor-not-allowed`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShiftPicker;
