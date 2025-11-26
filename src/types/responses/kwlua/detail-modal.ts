export interface DetailInfoKwluaItem {
  id: string;
  id_trans: string;
  id_wtp: string;
  id_petugas: string;
  jam: string;
  ntu: string;
  ph: string;
  file_ntu: string;
  file_ph: string;
  waktu_catat_ntu: string;
  waktu_catat_ph: string;
  nama_wtp: string;
  stts: string;
}

export interface DetailInfoKwluaResponse {
  success: boolean;
  message: string;
  data: DetailInfoKwluaItem[];
}
