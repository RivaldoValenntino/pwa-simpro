import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { ListCuciResponses } from "../../types/responses/pencucian/list-pencucian";

export const getListCuciData = async (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number
): Promise<ListCuciResponses> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListCuciResponses>(
    "/mobile/pencucian/list-data",
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

export const listCuciQuery = (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number | undefined
) =>
  queryOptions({
    queryKey: ["listCuciQuery", tanggal, kode_trans, id_installasi, jam],
    queryFn: () =>
      getListCuciData(tanggal, kode_trans, id_installasi, jam ?? 0),
    retry: false,
    staleTime: 0,
  });
