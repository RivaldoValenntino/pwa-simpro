export interface ListCipoletyResponses {
  success: boolean;
  message: string;
  data: CipoletyItem[];
}

interface CipoletyItem {
  id: string;
  id_trans: string;
  id_wtp: string;
  id_petugas: string | null;
  jam: string;
  cipolety1_tinggi: string | null;
  cipolety1_ld: string | null;
  cipolety2_tinggi: string | null;
  cipolety2_ld: string | null;
  file_cipolety1: string | null;
  latlong_cipolety1: string | null;
  waktu_catat_cipolety1: string | null;
  file_cipolety2: string | null;
  latlong_cipolety2: string | null;
  waktu_catat_cipolety2: string | null;
  created_dt: string | null;
  update_dt: string | null;
  nama_wtp: string;
  stts: string;
}
