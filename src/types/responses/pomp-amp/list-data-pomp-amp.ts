export type ListDataPompaAmpereResponses = {
  success: boolean;
  message: string;
  data: DataPompa[];
};

export type DataPompa = {
  id: string;
  id_trans: string;
  id_pompa: string;
  id_petugas: string | null;
  jam: string;
  jml_pompa: string;
  hz: string | null;
  file: string | null;
  latlong: string | null;
  waktu_catat: string | null;
  created_dt: string;
  update_dt: string | null;
  nama_pompa: string;
  files: string;
  count_status_on: string;
  count_status_off: string;
  stts: string;
};
