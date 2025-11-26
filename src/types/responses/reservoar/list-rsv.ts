export type ListReservoarData = {
  id: string;
  id_trans: string;
  id_reservoar: string;
  id_petugas: string | null;
  jam: string;
  level_air: string | null;
  ppm: string | null;
  sisa_khlor: string | null;
  file_level: string | null;
  latlong_level: string | null;
  waktu_catat_level: string | null;
  file_khlor: string | null;
  latlong_khlor: string | null;
  waktu_catat_khlor: string | null;
  created_dt: string | null;
  update_dt: string | null;
  nama_reservoar: string;
  level_awal: string | null;
  stts: string;
};

export type ListReservoarResponse = {
  success: boolean;
  message: string;
  data: ListReservoarData[];
};
