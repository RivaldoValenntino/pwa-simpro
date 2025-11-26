export interface ListMeterResponse {
  success: boolean;
  message: string;
  data: MeterProduksi[];
}

export interface MeterProduksi {
  id: string;
  id_trans: string;
  id_meter_produksi: string;
  id_petugas: string | null;
  jam: string;
  st_awal: number | null;
  st_akhir: number | null;
  kubikasi: number | null;
  debit: number | null;
  file: string | null;
  latlong: string | null;
  waktu_catat: string | null;
  created_dt: string | null;
  update_dt: string | null;
  stand_awal_sblm: number | null;
  nama_meter_produksi: string;
}
