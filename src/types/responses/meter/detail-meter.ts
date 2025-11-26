export type MeterDetail = {
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
  nama_meter_produksi: string;
};

export type DetailMeterResponse = {
  success: boolean;
  message: string;
  stand_awal: number;
  data: MeterDetail[];
};
