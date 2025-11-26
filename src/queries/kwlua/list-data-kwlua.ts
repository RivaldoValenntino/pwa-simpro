import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { ListDataKwluaResponse } from "../../types/responses/kwlua/list-kwlua";

export const getListDataKwlua = async (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number
): Promise<ListDataKwluaResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListDataKwluaResponse>(
    "/mobile/kwlua/list-data",
    {
      headers: {
        token: token,
      },
      params: {
        tanggal,
        kode_trans,
        id_installasi,
        jam,
      },
    }
  );
  return response.data;
};

export const listDataKwluaQuery = (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number | undefined
) =>
  queryOptions({
    queryKey: ["listDataKwluaQuery", tanggal, kode_trans, id_installasi, jam],
    queryFn: () =>
      getListDataKwlua(tanggal, kode_trans, id_installasi, jam ?? 0),
    retry: false,
    staleTime: 0,
  });
