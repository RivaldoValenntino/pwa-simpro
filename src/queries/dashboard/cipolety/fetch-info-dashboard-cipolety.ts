import { api } from "../../../libs/api";
import { useAuthStore } from "../../../store/auth";
import type { InfoDataCipoletyResponse } from "../../../types/responses/dashboard/cipolety/info-dashboard-cipolety";

export const fetchDataInfoDashboardCipolety = async (params: {
  id_installasi: string | undefined;
  tanggal: string | undefined;
  jam_sekarang: number | undefined;
}): Promise<InfoDataCipoletyResponse> => {
  const token = useAuthStore.getState().token;

  const response = await api.get<InfoDataCipoletyResponse>(
    "/mobile/dashboard/cipolety/info-cipolety",
    {
      headers: {
        token,
      },
      params,
    }
  );

  return response.data;
};
