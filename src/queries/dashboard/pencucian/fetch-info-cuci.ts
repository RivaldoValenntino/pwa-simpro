import { api } from "../../../libs/api";
import { useAuthStore } from "../../../store/auth";
import type { ChartCuciResponse } from "../../../types/responses/dashboard/pencucian/chart-cuci";

export const fetchDataInfoPencucianDashboard = async (params: {
  id_installasi: number | undefined;
  tanggal: string | undefined;
  jam_sekarang: number | undefined;
  kode_trans: string | undefined;
}): Promise<ChartCuciResponse> => {
  const token = useAuthStore.getState().token;

  const response = await api.get<ChartCuciResponse>(
    "/mobile/dashboard/pencucian/chart-pencucian",
    {
      headers: {
        token,
      },
      params,
    }
  );

  return response.data;
};
