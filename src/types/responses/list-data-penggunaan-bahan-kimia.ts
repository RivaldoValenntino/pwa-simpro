interface BahanKimia {
  id: string;
  id_trans: string;
  id_petugas: string;
  jenis_bahan_kimia: string;
  nilai: string;
  nama_petugas: string;
  keterangan: string;
  created_dt: string;
  update_dt: string | null;
}

export interface ListDataPenggunaanBahanKimiaResponse {
  success: boolean;
  message: string;
  data: BahanKimia[];
}
