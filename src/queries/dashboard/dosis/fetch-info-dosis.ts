import { api } from "../../../libs/api";
import { useAuthStore } from "../../../store/auth";
import type { DosisInfoDashboardResponse } from "../../../types/responses/dashboard/dosis/dosis-info";

export const fetchDataDosisDashboard = async (params: {
  id_installasi: number | undefined;
  tanggal: string | undefined;
  jam_sekarang: number | undefined;
  kode_trans: string | undefined;
}): Promise<DosisInfoDashboardResponse> => {
  const token = useAuthStore.getState().token;

  const response = await api.get<DosisInfoDashboardResponse>(
    "/mobile/dashboard/dosis/chart-dosis",
    {
      headers: {
        token,
      },
      params,
    }
  );

  return response.data;
};
