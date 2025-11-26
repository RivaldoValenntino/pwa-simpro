import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { DetailKwluaResponses } from "../../types/responses/kwlua/detail-kwlua";

export const getDataSebelumnyaKwlua = async (
  id: number,
  type: string | undefined
): Promise<DetailKwluaResponses> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<DetailKwluaResponses>("/mobile/kwlua/get-data-sebelumnya", {
    headers: {
      token: token,
    },
    params: {
      id,
      type,
    },
  });
  return response.data;
};

export const DataSebelumnyaKwluaQuery = (id: number, type: string | undefined) =>
  queryOptions({
    queryKey: ["DataSebelumnyaKwluaQuery", id, type],
    queryFn: () => getDataSebelumnyaKwlua(id, type),
    retry: false,
    staleTime: 0,
  });
