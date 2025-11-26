import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { DetailDataModalKimiaResponse } from "../../types/responses/kimia/detail-modal";

export const getDataDetailKimiaModal = async (
  id: number,
  type: string | undefined
): Promise<DetailDataModalKimiaResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<DetailDataModalKimiaResponse>(
    "/mobile/kimia/detail-info",
    {
      headers: {
        token: token,
      },
      params: {
        id,
        type,
      },
    }
  );
  return response.data;
};

export const DetailModalKimiaQuery = (id: number, type: string | undefined) =>
  queryOptions({
    queryKey: ["DetailModalKimiaQuery", id, type],
    queryFn: () => getDataDetailKimiaModal(id, type),
    retry: false,
    staleTime: 0,
    enabled: !!id,
  });
