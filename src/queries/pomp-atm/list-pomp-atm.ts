import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { PompaTekananKolektorListResponse } from "../../types/responses/pomp-atm/list-pomp-atm";

export const getListPompAtm = async (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number
): Promise<PompaTekananKolektorListResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<PompaTekananKolektorListResponse>(
    "/mobile/pomp-atm/list-data",
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

export const listPompAtmQuery = (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number | undefined
) =>
  queryOptions({
    queryKey: ["listPompAtmQuery", tanggal, kode_trans, id_installasi, jam],
    queryFn: () => getListPompAtm(tanggal, kode_trans, id_installasi, jam ?? 0),
    retry: false,
    staleTime: 0,
  });
