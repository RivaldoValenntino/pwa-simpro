import { queryOptions } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth";
import { api } from "../../libs/api";
import type { ListGensetResponses } from "../../types/responses/genset/list-genset";

export const getListQuery = async (
  id_installasi: number | undefined,
  tanggal?: string | undefined,
  limit?: number,
  offset?: number
): Promise<ListGensetResponses> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListGensetResponses>(
    "/mobile/trans-genset/list-data",
    {
      headers: {
        token: token,
      },
      params: {
        id_installasi,
        tanggal,
        limit,
        offset,
      },
    }
  );
  return response.data;
};

export const listGensetQuery = (
  id_installasi: number | undefined,
  tanggal?: string | undefined,
  limit?: number,
  offset?: number
) =>
  queryOptions({
    queryKey: ["listGensetQuery", id_installasi, tanggal, limit, offset],
    queryFn: () =>
      getListQuery(
        id_installasi,
        tanggal,
        limit ?? 20, // Default limit to 20 if not provided
        offset
      ),
    retry: false,
    staleTime: 0,
  });
