import { queryOptions } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth";
import { api } from "../libs/api";
import type { LogAktivitasResponse } from "../types/responses/fetch-activity-user";

export const getListDataActivityUser = async (
  id_petugas: number | undefined,
  tanggal_awal?: string,
  tanggal_akhir?: string,
  limit?: number,
  offset?: number
): Promise<LogAktivitasResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<LogAktivitasResponse>(
    "/mobile/fetch-activity-user",
    {
      headers: {
        token: token,
      },
      params: {
        id_petugas,
        tanggal_awal,
        tanggal_akhir,
        limit,
        offset,
      },
    }
  );
  return response.data;
};

export const listDataActivityUserQuery = (
  id_petugas: number | undefined,
  tanggal_awal?: string,
  tanggal_akhir?: string,
  limit?: number,
  offset?: number
) =>
  queryOptions({
    queryKey: [
      "listDataActivityUserQuery",
      id_petugas,
      tanggal_awal,
      tanggal_akhir,
      limit,
      offset,
    ],
    queryFn: () =>
      getListDataActivityUser(
        id_petugas,
        tanggal_awal,
        tanggal_akhir,
        limit ?? 20, // Default limit to 20 if not provided
        offset
      ),
    retry: false,
    staleTime: 0,
  });
