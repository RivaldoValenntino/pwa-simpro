export interface PemakaianKantorItem {
  id: string;
  id_trans: string;
  id_petugas: string | null;
  id_meter_pemakaian: string;
  st_awal: string | null;
  st_akhir: string | null;
  kubikasi: string | null;
  file: string | null;
  created_dt: string | null;
  update_dt: string | null;
  nama_installasi: string;
  nama_meter_produksi: string;
  waktu_catat: string | null;
}

export interface ListPemakaianKantorResponse {
  success: boolean;
  message: string;
  data: PemakaianKantorItem[];
  total: number;
}
