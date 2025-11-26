export interface DetailKwluaResponses {
  success: boolean;
  message: string;
  data: ItemKwlua[];
}

export interface ItemKwlua {
   id: string;
  id_trans: string;
  id_wtp: string;
  nama_wtp: string;
  id_petugas: string | null;
  jam: string;
  ntu: string | null;
  ph: string | null;
  file_ntu: string | null;
  file_ph: string | null;
  waktu_ntu: string | null;
  waktu_ph: string | null;
  created_dt: string;
  update_dt: string | null;
}
