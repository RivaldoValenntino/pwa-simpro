export interface WtpDebtDataResponse {
  success: boolean;
  message: string;
  data: WtpDebtDataItem[];
}

export interface WtpDebtDataItem {
  id: string;
  id_trans: string;
  id_wtp: string;
  id_petugas: string | null;
  jam: string;
  debit_ld: string | null;
  file: string | null;
  latlong: string | null;
  waktu_catat: string | null;
  created_dt: string;
  update_dt: string | null;
  nama_wtp: string;
  wtp_awal: string | null;
  stts: string;
}
