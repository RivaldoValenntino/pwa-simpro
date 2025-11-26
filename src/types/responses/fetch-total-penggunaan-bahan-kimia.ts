type Item = {
  jenis_bahan_kimia: string;
  total: string;
};

export type TotalPenggunaanBahanKimiaResponse = {
  code: number;
  message: string;
  data: Item[];
};
