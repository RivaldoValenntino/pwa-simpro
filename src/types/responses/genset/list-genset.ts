export interface GensetItem {
  id: string;
  id_trans: string;
  id_petugas: string;
  ampere: string;
  voltase: string;
  solar: string;
  durasi: string;
  jenis: string;
  filename: string;
  created_dt: string;
  update_dt: string | null;
  waktu: string;
  tgl: string;
}

export interface ListGensetResponses {
  success: boolean;
  message: string;
  data: GensetItem[];
  total: number;
}
