import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { ListCipoletyResponses } from "../../types/responses/cipolety/list-data";

export const getListCipolety = async (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number
): Promise<ListCipoletyResponses> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListCipoletyResponses>(
    "/mobile/cipolety/list-data",
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

export const listCipoletyQuery = (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number | undefined
) =>
  queryOptions({
    queryKey: ["listCipoletyQuery", tanggal, kode_trans, id_installasi, jam],
    queryFn: () =>
      getListCipolety(tanggal, kode_trans, id_installasi, jam ?? 0),
    retry: false,
    staleTime: 0,
  });
