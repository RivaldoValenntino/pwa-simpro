export interface GetPreviousDataResponse {
  status: boolean;
  message: string;
  data: PreviousDataItem[];
}

export interface PreviousDataItem {
  id: number;
  nama_reservoar: string;
  ppm: string;
  sisa_khlor: string;
  latlong_khlor: string;
  file_khlor: string;
}
