export interface ListDataKwluaResponse {
  success: boolean;
  message: string;
  data: KwluaItem[];
}

interface KwluaItem {
  id: string;
  id_trans: string;
  id_wtp: string;
  id_petugas: string | null;
  jam: string;
  air_baku_ntu: number | null;
  air_baku_ph: number | null;
  air_sediment_ntu: number | null;
  air_sediment_ph: number | null;
  air_produksi_ntu: number | null;
  air_produksi_ph: number | null;

  file_air_baku_ntu: string | null;
  file_air_baku_ph: string | null;
  file_air_sediment_ntu: string | null;
  file_air_sediment_ph: string | null;
  file_air_produksi_ntu: string | null;
  file_air_produksi_ph: string | null;

  waktu_catat_air_baku_ntu: string | null;
  waktu_catat_air_baku_ph: string | null;
  waktu_catat_air_sediment_ntu: string | null;
  waktu_catat_air_sediment_ph: string | null;
  waktu_catat_air_produksi_ntu: string | null;
  waktu_catat_air_produksi_ph: string | null;

  created_dt: string;
  update_dt: string | null;
  nama_wtp: string;
  stts: string;
}
