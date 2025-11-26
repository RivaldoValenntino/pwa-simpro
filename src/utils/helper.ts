/* eslint-disable @typescript-eslint/no-explicit-any */
export const buildFieldMap = (existing: any) => ({
  lwbp: {
    nilai: existing.lwbp,
    file: existing.file_lwbp,
    latlong: existing.latlong_lwbp,
    waktu: existing.waktu_catat_lwbp,
  },
  wbp: {
    nilai: existing.wbp,
    file: existing.file_wbp,
    latlong: existing.latlong_wbp,
    waktu: existing.waktu_catat_wbp,
  },
  kvrh: {
    nilai: existing.kvrh,
    file: existing.file_kvrh,
    latlong: existing.latlong_kvrh,
    waktu: existing.waktu_catat_kvrh,
  },
});

export const getSelectedField = (existing: any, type: string | undefined) => {
  const map = buildFieldMap(existing);
  return map[type as keyof typeof map];
};

export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, { type: blob.type, lastModified: Date.now() });
}

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

export function getShiftInfo() {
  const now = new Date();

  let hour = now.getHours();
  const minutes = now.getMinutes();

  if (minutes >= 50) {
    hour = (hour + 1) % 24; 
  }

  const slot = allTimeSlots.find((x) => x.val === (hour === 0 ? 24 : hour));

  const shiftDate = new Date(now);

  if (hour == 7 && minutes < 50) {
    shiftDate.setDate(shiftDate.getDate() - 1);
  }

  return {
    shiftHour: slot?.val ?? hour,
    shiftDate: shiftDate.toISOString().split("T")[0],
  };
}
