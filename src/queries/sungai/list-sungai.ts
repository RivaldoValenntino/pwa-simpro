import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { ListIntakeSungaiResponse } from "../../types/responses/sungai/list-sungai";

export const getListSungai = async (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number
): Promise<ListIntakeSungaiResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListIntakeSungaiResponse>(
    "/mobile/intake-sungai/list-data",
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

export const listSungaiQuery = (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number | undefined
) =>
  queryOptions({
    queryKey: ["listSungaiQuery", tanggal, kode_trans, id_installasi, jam],
    queryFn: () => getListSungai(tanggal, kode_trans, id_installasi, jam ?? 0),
    retry: false,
    staleTime: 0,
  });
