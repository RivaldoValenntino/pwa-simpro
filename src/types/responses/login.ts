export type User = {
  id: number;
  nama: string;
  id_role: number;
  is_pengawas: number;
  hak_akses: number | null | string;
  id_installasi: string;
  nama_installasi: string;
  nama_shift: string | null;
  nama_group: string | null;
  pgw_id: number;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type LoginPost = {
  username: string;
  password: string;
};
