import { queryOptions } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth";
import { api } from "../../libs/api";
import type { ListRefMeterKantorResponse } from "../../types/responses/pemakaian-kantor/ref-meter-kantor";

export const getListRefMeterKantor = async (
  id_installasi: number | undefined
): Promise<ListRefMeterKantorResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListRefMeterKantorResponse>(
    "/mobile/pemakaian-kantor/referensi-meter",
    {
      headers: {
        token: token,
      },
      params: {
        id_installasi,
      },
    }
  );
  return response.data;
};

export const listRefMeterKantorQuery = (id_installasi: number | undefined) =>
  queryOptions({
    queryKey: ["listRefMeterKantorQuery", id_installasi],
    queryFn: () => getListRefMeterKantor(id_installasi),
    retry: false,
    staleTime: 0,
  });
