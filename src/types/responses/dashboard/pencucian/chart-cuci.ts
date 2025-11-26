export interface ChartCuciItem {
  id_wtp: string;
  nama_wtp: string;
  total_sedimen: string; // bisa jadi number kalau DB selalu kasih angka
  total_filtrasi: string;
  total_flokulator: string;
  jumlah_cuci_sedimen: string;
  jumlah_cuci_filtrasi: string;
  jumlah_cuci_flokulator: string;
  daftar_bak_sedimen: string;
  daftar_bak_filtrasi: string;
  daftar_bak_flokulator: string;
}

export interface ChartCuciResponse {
  success: boolean;
  message: string;
  data: ChartCuciItem[];
}
