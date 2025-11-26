interface MeterPlnData {
  id: string;
  id_trans: string;
  id_meter_pln: string;
  id_petugas: string | null;
  jam: string;
  lwbp: string | null;
  wbp: string | null;
  kvrh: string | null;
  file_lwbp: string | null;
  file_wbp: string | null;
  file_kvrh: string | null;
  latlong_lwbp: string | null;
  latlong_wbp: string | null;
  latlong_kvrh: string | null;
  waktu_catat_lwbp: string | null;
  waktu_catat_wbp: string | null;
  waktu_catat_kvrh: string | null;
  created_dt: string | null;
  update_dt: string | null;
  nama_meter_pln: string;
  lwbp_prev: string;
  wbp_prev: string;
  kvrh_prev: string;
  stts: string;
}

export interface ListMeterPlnResponse {
  success: boolean;
  message: string;
  data: MeterPlnData[];
}
