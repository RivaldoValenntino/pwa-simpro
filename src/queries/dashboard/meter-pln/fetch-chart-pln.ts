import { api } from "../../../libs/api";
import { useAuthStore } from "../../../store/auth";
import type { DynamicChartResponse } from "../../../types/responses/dynamic-chart";

export const fetchDataMeterPlnChart = async (params: {
  id_installasi: string | undefined;
  tanggal: string | undefined;
  jam_sekarang: number | undefined;
  kode_trans: string | undefined;
}): Promise<DynamicChartResponse> => {
  const token = useAuthStore.getState().token;

  const response = await api.get<DynamicChartResponse>(
    "/mobile/dashboard/meter-pln/chart-meter-pln",
    {
      headers: {
        token,
      },
      params,
    }
  );

  return response.data;
};
