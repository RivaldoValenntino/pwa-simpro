export interface ItemKimia {
  id: string;
  id_trans: string;
  id_wtp: string;
  id_petugas: string | null;
  jam: string;
  alum_dosis: string | null;
  alum_dosring: string | null;
  alum_const: string | null;
  pac_dosis: string | null;
  pac_dosring: string | null;
  pac_const: string | null;
  sodaash_dosis: string | null;
  sodaash_dosring: string | null;
  sodaash_const: string | null;
  kaporit_dosis: string | null;
  kaporit_dosring: string | null;
  kaporit_const: string | null;
  file_alum: string | null;
  file_pac: string | null;
  file_sodaash: string | null;
  waktu_catat_alum: string | null;
  waktu_catat_pac: string | null;
  waktu_catat_sodaash: string | null;
  waktu_catat_kaporit: string | null;
  created_dt: string;
  update_dt: string | null;
  nama_wtp: string;
  stts: string;
}

export interface ListDataKimiaResponses {
  success: boolean;
  message: string;
  data: ItemKimia[];
}
