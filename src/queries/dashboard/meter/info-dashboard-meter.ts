import { api } from "../../../libs/api";
import { useAuthStore } from "../../../store/auth";
import type { InfoDataMeterResponse } from "../../../types/responses/dashboard/meter/info-dashboard-meter";

export const fetchDataInfoDashboardMeter = async (params: {
  id_installasi: string | undefined;
  tanggal: string | undefined;
  id_meter: number | undefined;
  jam_sekarang: number | undefined;
  kode_trans: string | undefined;
}): Promise<InfoDataMeterResponse> => {
  const token = useAuthStore.getState().token;

  const response = await api.get<InfoDataMeterResponse>(
    "/mobile/dashboard/meter/info-meter",
    {
      headers: {
        token,
      },
      params,
    }
  );

  return response.data;
};
