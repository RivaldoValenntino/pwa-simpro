import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { ListDataKimiaResponses } from "../../types/responses/kimia/list-kimia";

export const getListDataKimia = async (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number
): Promise<ListDataKimiaResponses> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListDataKimiaResponses>(
    "/mobile/kimia/list-data",
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

export const listDataKimiaQuery = (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number | undefined
) =>
  queryOptions({
    queryKey: ["listDataKimiaQuery", tanggal, kode_trans, id_installasi, jam],
    queryFn: () =>
      getListDataKimia(tanggal, kode_trans, id_installasi, jam ?? 0),
    retry: false,
    staleTime: 0,
  });
