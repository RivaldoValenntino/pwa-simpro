import { queryOptions } from "@tanstack/react-query";
import type { ListAnomaliResponse } from "../../types/responses/trans-anomali/list-anomali";
import { useAuthStore } from "../../store/auth";
import { api } from "../../libs/api";

export const getListAnomali = async (
  id_installasi: number | undefined,
  limit?: number,
  offset?: number
): Promise<ListAnomaliResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListAnomaliResponse>(
    "/mobile/trans-anomali/list-data",
    {
      headers: {
        token: token,
      },
      params: {
        id_installasi,
        limit,
        offset,
      },
    }
  );
  return response.data;
};

export const listAnomaliQuery = (
  id_installasi: number | undefined,
  limit?: number,
  offset?: number
) =>
  queryOptions({
    queryKey: ["listAnomaliQuery", id_installasi, limit, offset],
    queryFn: () =>
      getListAnomali(
        id_installasi,
        limit ?? 20, // Default limit to 20 if not provided
        offset
      ),
    retry: false,
    staleTime: 0,
  });
