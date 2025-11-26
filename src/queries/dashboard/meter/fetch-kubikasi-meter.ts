import { api } from "../../../libs/api";
import { useAuthStore } from "../../../store/auth";
import type { KubikasiResponse } from "../../../types/responses/dashboard/meter/chart-meter";

export const fetchDataChartKubikasiMeter = async (params: {
  id_installasi: string | undefined;
  tanggal: string | undefined;
  jam_sekarang: number | undefined;
  kode_trans: string | undefined;
}): Promise<KubikasiResponse> => {
  const token = useAuthStore.getState().token;

  const response = await api.get<KubikasiResponse>(
    "/mobile/dashboard/meter/chart-meter",
    {
      headers: {
        token,
      },
      params,
    }
  );

  return response.data;
};
