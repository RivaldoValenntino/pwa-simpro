export interface RefAnomaliResponse {
  success: boolean;
  message: string;
  data: RefAnomaliItem[];
}

export interface RefAnomaliItem {
  id: number;
  nama: string;
}
