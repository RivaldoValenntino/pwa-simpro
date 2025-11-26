import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { ListReservoarResponse } from "../../types/responses/reservoar/list-rsv";

export const getListReservoar = async (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number
): Promise<ListReservoarResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListReservoarResponse>(
    "/mobile/reservoar/list-data",
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

export const listReservoarQuery = (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number | undefined
) =>
  queryOptions({
    queryKey: ["listReservoarQuery", tanggal, kode_trans, id_installasi, jam],
    queryFn: () =>
      getListReservoar(tanggal, kode_trans, id_installasi, jam ?? 0),
    retry: false,
    staleTime: 0,
  });
