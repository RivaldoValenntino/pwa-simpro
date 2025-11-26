export interface PompaTekananKolektorListResponse {
  success: boolean;
  message: string;
  data: PompaTekananKolektor[];
}

export interface PompaTekananKolektor {
  id: string;
  id_trans: string;
  id_pompa_tekanan_kolektor: string;
  id_petugas: string | null;
  jam: string;
  atm: number | null;
  file: string | null;
  latlong: string | null;
  waktu_catat: string | null;
  created_dt: string;
  update_dt: string | null;
  nama_pompa: string;
  atm_awal: number | null;
  stts: string;
}
