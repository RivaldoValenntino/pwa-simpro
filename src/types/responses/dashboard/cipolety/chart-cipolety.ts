export interface ChartCipoletyItem {
  id_wtp: string;
  nama: string;
  jam: string;
  chart1: string;
  chart2: string;
  nilai_akhir_tinggi_1: string;
  nilai_akhir_ld_1: string;
  nilai_akhir_tinggi_2: string;
  nilai_akhir_ld_2: string;
  total_air_produksi: string;
  keterangan: string;
}

export interface ChartCipoletyResponses {
  success: boolean;
  message: string;
  data: ChartCipoletyItem[];
}
