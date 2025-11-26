export interface ShiftResponse {
  success: boolean;
  message: string;
  data: ShiftData[];
}

export interface ShiftData {
  nama_user: string;
  tgl: string; // format YYYY-MM-DD
  kd_shift_group: string; // "P" | "M" | dll
  nama_shift: string;
  nama_group: string;
  nama_installasi: string;
}
