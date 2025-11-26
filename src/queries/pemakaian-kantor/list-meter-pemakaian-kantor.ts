import { queryOptions } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth";
import { api } from "../../libs/api";
import type { ListPemakaianKantorResponse } from "../../types/responses/pemakaian-kantor/list-meter-pemakaian-kantor";

export const getListPemakaianKantor = async (
  id_installasi: number | undefined,
  tanggal?: string,
  limit?: number,
  offset?: number
): Promise<ListPemakaianKantorResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListPemakaianKantorResponse>(
    "/mobile/pemakaian-kantor/list-data",
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

export const listPemakaianKantorQuery = (
  id_installasi: number | undefined,
  tanggal?: string,
  limit?: number,
  offset?: number
) =>
  queryOptions({
    queryKey: [
      "listPemakaianKantorQuery",
      id_installasi,
      tanggal,
      limit,
      offset,
    ],
    queryFn: () =>
      getListPemakaianKantor(
        id_installasi,
        tanggal,
        limit ?? 20, // Default limit to 20 if not provided
        offset
      ),
    retry: false,
    staleTime: 0,
  });
