import { api } from "../../../libs/api";
import { useAuthStore } from "../../../store/auth";
import type { DynamicChartResponse } from "../../../types/responses/dynamic-chart";

export const fetchDataPompAtmDashboard = async (params: {
  id_installasi: number | undefined;
  tanggal: string | undefined;
  jam_sekarang: number | undefined;
  kode_trans: string | undefined;
}): Promise<DynamicChartResponse> => {
  const token = useAuthStore.getState().token;

  const response = await api.get<DynamicChartResponse>(
    "/mobile/dashboard/pomp-atm/chart-pomp-atm",
    {
      headers: {
        token,
      },
      params,
    }
  );

  return response.data;
};
