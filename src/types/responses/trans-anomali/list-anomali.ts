export interface ListAnomaliResponse {
  success: boolean;
  message: string;
  data: AnomaliData[];
  total: number;
}
export interface AnomaliData {
  id: string;
  tgl: string;
  waktu: string;
  id_installasi: string;
  id_jenis_anomali: string;
  keterangan: string;
  dampak: string;
  resiko: string | null;
  foto: string;
  id_petugas: string;
  created_dt: string | null;
  created_user: string | null;
  is_closed: string;
  feedback_closed: string;
  foto_realisasi: string;
  nama_installasi: string;
  nama_anomali: string;
  petugas_realisasi: string;
  tanggal_realisasi: string;
  waktu_realisasi: string;
}
