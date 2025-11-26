export interface RefMeterKantorItem {
  id: string;
  id_installasi: number;
  nama_meter_produksi: string;
  nilai_meter_kalibrasi: number | null;
}

export interface ListRefMeterKantorResponse {
  success: boolean;
  message: string;
  data: RefMeterKantorItem[];
  total: number;
}
