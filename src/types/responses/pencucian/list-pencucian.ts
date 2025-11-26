export interface CuciItem {
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
  sedimen_awal: string;
  filtrasi_awal: string;
  daftar_bak_sedimen: string;
  daftar_bak_filtrasi: string;
  daftar_bak_flokulator: string;
  update_dt_awal: string;
  nilai_sedimen_awal: string;
  nilai_filtrasi_awal: string;
  nilai_flokulator_awal: string;
  flokulator_awal: string;
  is_sedimen_exist: string;
  is_filtrasi_exist: string;
  is_flokulator_exist: string;
  stts: string;
}

export interface ListCuciResponses {
  success: boolean;
  message: string;
  data: CuciItem[];
}
