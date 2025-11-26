export interface InfoDataMeter {
  nama: string;
  id_meter: string;
  liter_per_detik: string;
  total: string;
  st_awal: string;
  st_akhir: string;
}

export interface InfoDataMeterResponse {
  success: boolean;
  message: string;
  data: InfoDataMeter[];
}
