export interface LogAktivitasResponse {
  success: boolean;
  message: string;
  data: LogAktivitasItem[];
  total: number;
}

export interface LogAktivitasItem {
  id: string;
  tgl: string; // format: yyyy-mm-dd
  jam: string; // format: HH:mm:ss
  data: string; // masih dalam bentuk JSON string, bisa di-parse
  action: string;
  created_at: string; // format: yyyy-mm-dd HH:mm:ss
  stts: string;
}
