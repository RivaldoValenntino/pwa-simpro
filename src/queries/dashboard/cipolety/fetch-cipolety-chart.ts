import { api } from "../../../libs/api";
import { useAuthStore } from "../../../store/auth";
import type { ChartCipoletyResponses } from "../../../types/responses/dashboard/cipolety/chart-cipolety";

export const fetchDataChartCipolety = async (params: {
  id_installasi: string | undefined;
  tanggal: string | undefined;
  jam_sekarang: number | undefined;
}): Promise<ChartCipoletyResponses> => {
  const token = useAuthStore.getState().token;

  const response = await api.get<ChartCipoletyResponses>(
    "/mobile/dashboard/cipolety/chart-cipolety",
    {
      headers: {
        token,
      },
      params,
    }
  );

  return response.data;
};
