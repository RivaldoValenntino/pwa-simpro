import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { ListMeterPlnResponse } from "../../types/responses/meter-pln/list-mtr-pln";

export const getListMeterPln = async (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number
): Promise<ListMeterPlnResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListMeterPlnResponse>(
    "/mobile/meter-pln/list-data",
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

export const ListMeterPlnQuery = (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number | undefined
) =>
  queryOptions({
    queryKey: ["ListMeterPlnQuery", tanggal, kode_trans, id_installasi, jam],
    queryFn: () =>
      getListMeterPln(tanggal, kode_trans, id_installasi, jam ?? 0),
    retry: false,
    staleTime: 0,
  });
