import { queryOptions } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth";
import { api } from "../../libs/api";
import type { ListHoursMeterPompaResponse } from "../../types/responses/hours-pompa/list-data";

export const getListHoursMeterPompa = async (
  id_installasi: number | undefined,
  tanggal?: string,
  limit?: number,
  offset?: number
): Promise<ListHoursMeterPompaResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListHoursMeterPompaResponse>(
    "/mobile/hours-pompa/list-data",
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

export const listHoursMeterPompaQuery = (
  id_installasi: number | undefined,
  tanggal?: string,
  limit?: number,
  offset?: number
) =>
  queryOptions({
    queryKey: [
      "listHoursMeterPompaQuery",
      id_installasi,
      tanggal,
      limit,
      offset,
    ],
    queryFn: () =>
      getListHoursMeterPompa(
        id_installasi,
        tanggal,
        limit ?? 20, // Default limit to 20 if not provided
        offset
      ),
    retry: false,
    staleTime: 0,
  });
