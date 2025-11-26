interface KubikasiData {
  nama: string;
  id_meter: number;
  jam: string; // bisa dikonversi ke `number[]` jika di-split
  chart: string; // bisa juga jadi `number[]`
  nilai_awal: string; // bisa jadi `number` kalau parsing
  nilai_akhir: string;   // bisa jadi `number`
  total: string;         // bisa jadi `number`
  keterangan: string; 
}

export interface KubikasiResponse {
  success: boolean;
  message: string;
  data: KubikasiData[];
}
