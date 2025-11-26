export interface ReferensiMaster {
  id: string;
  id_installasi: string;
  nama_meter_produksi: string;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}

export interface ReferensiMasterResponse {
  success: boolean;
  message: string;
  data: ReferensiMaster[];
}
