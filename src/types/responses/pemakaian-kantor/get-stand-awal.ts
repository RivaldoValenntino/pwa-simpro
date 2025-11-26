export interface GetStandAwalMeterKantorItem {
  stand_akhir: string;
  tgl_sumber: string;
  id_detail: string;
}

export interface GetStandAwalMeterKantorResponse {
  success: boolean;
  message: string;
  data: GetStandAwalMeterKantorItem;
}
