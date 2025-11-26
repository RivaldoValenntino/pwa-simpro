export function formatTanggalIndo(tgl: string | undefined): string {
  if (!tgl) return "-";
  const bulanIndo = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const [tahun, bulan, hari] = tgl.split("-");
  return `${parseInt(hari)} ${bulanIndo[parseInt(bulan) - 1]} ${tahun}`;
}

export function getNextHourDate(date: Date): Date {
  const next = new Date(date);
  next.setHours(date.getHours() + 1, 0, 0, 0);
  return next;
}

export function formatIndoDate(date: Date): string {
  return date.toLocaleString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getCountdownToNextHour(now: Date): string {
  const nextHour = getNextHourDate(now);
  const diffMs = nextHour.getTime() - now.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function getShiftDate(d: Date): Date {
  const hour = d.getHours();
  const shiftDate = new Date(d); // copy
  const minutes = d.getMinutes();
  if (hour === 7 && minutes < 50) {
    // sebelum jam 07:50, masih shift malam
    shiftDate.setDate(shiftDate.getDate() - 1);
  }
  return shiftDate;
}

export const normalizeJam = (val: number) => (val === 24 ? 24 : val);

export const checkisPastJamFn = (
  jamParam: string | number,
  currentHour: number
): boolean => {
  const jamParamNormalized = normalizeJam(Number(jamParam));

  // case 1: kalau jam sekarang 0 dan jamParam di range 20–23
  if (
    currentHour === 0 &&
    jamParamNormalized >= 20 &&
    jamParamNormalized <= 23
  ) {
    return true;
  }

  // case 2: kalau jam sekarang 20–23 dan jamParam di range 1–7 atau 24
  if (currentHour >= 20 && currentHour <= 23) {
    if (
      jamParamNormalized === 24 ||
      (jamParamNormalized >= 1 && jamParamNormalized <= 7)
    ) {
      return false;
    }
  }

  // case 3: kalau jam sekarang 1–7 dan jamParam di range 20–24
  if (currentHour >= 1 && currentHour <= 7) {
    if (jamParamNormalized >= 20 && jamParamNormalized <= 24) {
      return true;
    }
  }

  // case 4: kalau jam sekarang 0 dan jamParam di range 1–7
  if (currentHour === 0 && jamParamNormalized >= 1 && jamParamNormalized <= 7) {
    return false;
  }

  // default normal case
  return jamParamNormalized < currentHour;
};

export function formateDateTimeIndo(dateTimeStr: string): string {
  if (!dateTimeStr) return "-";

  const dateObj = new Date(dateTimeStr.replace(" ", "T"));

  const tanggal = dateObj.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const waktu = dateObj.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return `${tanggal} , ${waktu}`;
}
export function isInShiftPagi(jamServer: number, menitServer: number) {
  // 07:50 – 19:49
  if (jamServer > 7 && jamServer < 19) return true;
  if (jamServer === 7 && menitServer >= 50) return true;
  if (jamServer === 19 && menitServer < 50) return true;
  return false;
}

export function isInShiftMalam(jamServer: number, menitServer: number) {
  // 19:50 – 07:49
  if (jamServer > 19 || jamServer < 7) return true;
  if (jamServer === 19 && menitServer >= 50) return true;
  if (jamServer === 7 && menitServer < 50) return true;
  return false;
}
