export interface InfoDataCipolety {
  id_wtp: string;
  nilai_tinggi_1: string;
  nilai_tinggi_2: string;
  nilai_ld_1: string;
  nilai_ld_2: string;
  total_air_produksi: string;
}

export interface InfoDataCipoletyResponse {
  success: boolean;
  message: string;
  data: InfoDataCipolety[];
}
