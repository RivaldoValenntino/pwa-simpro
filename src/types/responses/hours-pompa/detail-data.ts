export interface DetailHoursMeterResponse {
  success: boolean;
  message: string;
  data: DetailHoursMeterPompaItem[];
}

export interface DetailHoursMeterPompaItem {
  id: string;
  id_trans: string;
  id_petugas: string;
  id_pompa: string;
  nilai: string;
  file: string;
  created_dt: string;
}
