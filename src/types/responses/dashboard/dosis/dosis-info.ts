interface DashboardInfoData {
  id_reservoar: string;
  nama_reservoar: string;
  ppm: string | null;
  sisa_khlor: string | null;
}

export interface DosisInfoDashboardResponse {
  success: boolean;
  message: string;
  data: DashboardInfoData[];
}
