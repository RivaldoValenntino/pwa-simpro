import { queryOptions } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth";
import { api } from "../../libs/api";
import type { DetailPemakaianKantorResponse } from "../../types/responses/pemakaian-kantor/detail-data";

export const DetailMeterKantor = async (
  id: number | undefined
): Promise<DetailPemakaianKantorResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<DetailPemakaianKantorResponse>(
    "/mobile/pemakaian-kantor/detail",
    {
      headers: {
        token: token,
      },
      params: {
        id,
      },
    }
  );
  return response.data;
};

export const detailMeterKantorQuery = (id: number | undefined) =>
  queryOptions({
    queryKey: ["detailMeterKantorQuery", id],
    queryFn: () => DetailMeterKantor(id),
    retry: false,
    staleTime: 0,
  });
