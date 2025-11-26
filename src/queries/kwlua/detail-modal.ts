import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { DetailInfoKwluaResponse } from "../../types/responses/kwlua/detail-modal";

export const getDataDetailKwlua = async (
  id: number,
  type: string | undefined
): Promise<DetailInfoKwluaResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<DetailInfoKwluaResponse>(
    "/mobile/kwlua/detail-info",
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

export const DetailModalKwluaQuery = (id: number, type: string | undefined) =>
  queryOptions({
    queryKey: ["DetailModalKwluaQuery", id, type],
    queryFn: () => getDataDetailKwlua(id, type),
    retry: false,
    staleTime: 0,
    enabled: !!id,
  });
