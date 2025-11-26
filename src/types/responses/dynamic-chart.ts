export interface ChartData {
  id_child: string;
  nama: string;
  jam: string; // bisa dikonversi ke `number[]` jika di-split
  chart: string; // bisa juga jadi `number[]`
  nilai_awal: string; // bisa jadi `number` kalau parsing
  nilai_akhir: string; // bisa jadi `number`
  total: string; // bisa jadi `number`
  keterangan: string; // bisa jadi `number`
  liter_per_detik: string;
}

export interface DynamicChartResponse {
  success: boolean;
  message: string;
  data: ChartData[];
}
