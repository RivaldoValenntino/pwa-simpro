export interface DetailPemakaianKantorResponse {
  success: boolean;
  message: string;
  data: DetailPemakaianKantorItem[];
}

export interface DetailPemakaianKantorItem {
  id: string;
  id_petugas: string;
  id_meter_pemakaian: string;
  id_trans: string;
  st_awal: string;
  st_akhir: string;
  file: string;
  kubikasi: string;
  created_dt: string;
  updated_dt: string;
  nama_meter_produksi: string;
}
