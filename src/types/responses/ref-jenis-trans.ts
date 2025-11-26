export interface RefJenisResponse {
  code: number;
  message: string;
  data: RefJenis[];
}

export interface RefJenis {
  kode: string;
  nama: string;
  is_per_jam: string;
  is_exist: number;
  jumlah_catat: string;
  v_total: string;
  persentase_catat: string;
  jenis: string;
}
