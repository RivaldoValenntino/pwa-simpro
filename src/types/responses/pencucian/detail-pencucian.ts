export interface DetailPencucianResponse {
  success: boolean;
  message: string;
  data: PencucianDetail[];
}

interface PencucianDetail {
  id: string;
  id_trans: string;
  id_wtp: string;
  id_petugas: string | null;
  jam: string;
  jml_sedimen: string;
  jml_filtrasi: string;
  jml_flokulator: string;
  latlong: string | null;
  waktu_catat: string | null;
  created_dt: string;
  update_dt: string | null;
  nama_wtp: string;
}
