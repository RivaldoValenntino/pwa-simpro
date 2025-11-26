import { queryOptions } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth";
import { api } from "../libs/api";
import type { TotalPenggunaanBahanKimiaResponse } from "../types/responses/fetch-total-penggunaan-bahan-kimia";

export const getListTotalPenggunaanBahanKimia = async (
  id_petugas: number | undefined,
  tanggal: string | undefined
): Promise<TotalPenggunaanBahanKimiaResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<TotalPenggunaanBahanKimiaResponse>(
    "/mobile/fetch-penggunaan-bahan-kimia",
    {
      headers: {
        token: token,
      },
      params: {
        id_petugas,
        tanggal,
      },
    }
  );
  return response.data;
};

export const listTotalPenggunaanBahanKimiaQuery = (
  id_petugas: number | undefined,
  tanggal: string | undefined
) =>
  queryOptions({
    queryKey: ["listTotalPenggunaanBahanKimiaQuery", id_petugas, tanggal],
    queryFn: () => getListTotalPenggunaanBahanKimia(id_petugas, tanggal),
    retry: false,
    staleTime: 0,
  });
