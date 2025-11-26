export interface PompaAmpereDetailResponse {
  success: boolean;
  message: string;
  data: PompaData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  child: PompaDataChild[] | any[];
  spek_pompa: SpekPompa[] | [];
}

export interface PompaData {
  id: string;
  id_trans: string;
  id_pompa: string;
  id_petugas: string | null;
  jam: string;
  jml_pompa: string;
  hz: string;
  file: string | null;
  latlong: string | null;
  waktu_catat: string | null;
  created_dt: string;
  update_dt: string;
  nama_pompa: string | undefined;
}

interface PompaDataChild {
  id: string;
  id_trans_pompa: string;
  urutan: string;
  status_on: string;
  nilai: string;
}

interface SpekPompa {
  id: string;
  id_pompa: string;
  keterangan: string;
  urutan_ke: string;
}
