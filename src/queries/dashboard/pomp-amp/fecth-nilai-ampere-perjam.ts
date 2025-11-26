import { api } from "../../../libs/api";
import { useAuthStore } from "../../../store/auth";
import type { PompaAmpereDataPerjamResponses } from "../../../types/responses/dashboard/pomp-amp/chart-amp";

export const fetchDataChartPompAmp = async (params: {
  tanggal: string | undefined;
  kode_trans: string | undefined;
  id_installasi: number | undefined;
  jam_sekarang: number | undefined;
}): Promise<PompaAmpereDataPerjamResponses> => {
  const token = useAuthStore.getState().token;

  const response = await api.get<PompaAmpereDataPerjamResponses>(
    "/mobile/dashboard/pomp-amp/chart-pomp-amp",
    {
      headers: {
        token,
      },
      params,
    }
  );

  return response.data;
};
