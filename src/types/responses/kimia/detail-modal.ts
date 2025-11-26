export interface DetailDataModalKimiaResponse {
  success: boolean;
  message: string;
  data: DataKimia[];
}

export interface DataKimia {
  id: string;
  id_trans: string;
  id_wtp: string;
  id_petugas: string;
  jam: string;
  dosis: string;
  dosring: string;
  cons: string;
  file: string;
  waktu_catat: string;
  nama_wtp: string;
  stts: string;
}
