export interface SungaiData {
  id: string;
  id_trans: string;
  id_sungai: string;
  id_petugas: string | null;
  jam: string;
  level_sungai: string;
  file: string | null;
  latlong: string | null;
  waktu_catat: string | null;
  created_dt: string;
  update_dt: string | null;
  nama_sungai: string;
}

export interface DetailSungaiResponse {
  success: boolean;
  message: string;
  nilai_awal: number;
  data: SungaiData[];
}
