export interface WtpDebtItem {
  id: string;
  id_trans: string;
  id_wtp: string;
  id_petugas: string | null;
  jam: string;
  debit_ld: number | null;
  file: string | null;
  latlong: string | null;
  waktu_catat: string | null;
  created_dt: string;
  update_dt: string | null;
  nama_wtp: string;
}

export interface WtpDebtResponse {
  success: boolean;
  message: string;
  nilai_awal: number;
  data: WtpDebtItem[];
}
