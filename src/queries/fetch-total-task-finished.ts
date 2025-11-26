import { queryOptions } from "@tanstack/react-query";
import type { FinishedTaskResponse } from "../types/responses/task-finished";
import { useAuthStore } from "../store/auth";
import { api } from "../libs/api";

export const getListTaskFinished = async (
  id_installasi: number | undefined,
  tanggal: string | undefined,
  kode_trans: string | undefined,
  jam: number
): Promise<FinishedTaskResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<FinishedTaskResponse>(
    "/mobile/fetch-total-task-finished",
    {
      headers: {
        token: token,
      },
      params: {
        id_installasi,
        tanggal,
        kode_trans,
        jam,
      },
    }
  );
  return response.data;
};

export const listTaskFinisedQuery = (
  id_installasi: number | undefined,
  tanggal: string | undefined,
  kode_trans: string | undefined,
  jam: number | undefined
) =>
  queryOptions({
    queryKey: ["listTaskFinisedQuery", id_installasi, tanggal, kode_trans, jam],
    queryFn: () =>
      getListTaskFinished(id_installasi, tanggal, kode_trans, jam ?? 0),
    retry: false,
    staleTime: 0,
  });
