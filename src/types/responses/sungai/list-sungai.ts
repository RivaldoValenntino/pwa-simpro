export interface ListIntakeSungai {
  id: string;
  id_trans: string;
  id_sungai: string;
  id_petugas: string | null;
  jam: string;
  level_sungai: string | null;
  file: string | null;
  latlong: string | null;
  waktu_catat: string | null;
  created_dt: string;
  update_dt: string | null;
  nama_meter_produksi: string;
  level_awal: string | null;
  stts: string;
}

export interface ListIntakeSungaiResponse {
  success: boolean;
  message: string;
  data: ListIntakeSungai[];
}
