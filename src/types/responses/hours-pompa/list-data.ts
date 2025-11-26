export interface HoursMeterItem {
  id: string;
  id_trans: string;
  urut_ke: string;
  nama_pompa: string;
  nilai: string;
  file: string | null;
  created_dt: string | null;
  update_dt: string | null;
  nama_installasi: string;
  waktu_catat: string | null;
  tgl: string | null;
}

export interface ListHoursMeterPompaResponse {
  success: boolean;
  message: string;
  data: HoursMeterItem[];
  total: number;
}
