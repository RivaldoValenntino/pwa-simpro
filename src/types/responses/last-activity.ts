export interface LastActivityResponse {
  success: boolean;
  message: string;
  data: LastActivityData;
}

export interface LastActivityData {
  id_petugas: string | undefined;
  tgl: string | undefined;
  jam: string | undefined;
  created_at: string | undefined;
}
