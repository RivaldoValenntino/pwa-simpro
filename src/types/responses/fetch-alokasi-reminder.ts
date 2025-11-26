export interface ListAlokasiJadwalReminderRes {
  success: boolean;
  message: string;
  data: AlokasiJadwalReminderItem[];
}

export interface AlokasiJadwalReminderItem {
  kode: string;
  nama: string; // format: yyyy-mm-dd
  tgl_terakhir: string; // format: HH:mm:ss
  sisa_hari: string; // masih dalam bentuk JSON string, bisa di-parse
  status: "danger" | "warning" | "success";
  keterangan: string
}
