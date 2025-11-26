export interface DetailPencucianChildResponse {
  success: boolean;
  message: string;
  data: PencucianChildDetail[];
}

interface PencucianChildDetail {
  jenis: string;
  urut_ke: string;
  nama_cuci: string;
  nilai: string | null;
}
