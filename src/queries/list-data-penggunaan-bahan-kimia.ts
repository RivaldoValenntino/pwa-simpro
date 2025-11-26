import { queryOptions } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth";
import { api } from "../libs/api";
import type { ListDataPenggunaanBahanKimiaResponse } from "../types/responses/list-data-penggunaan-bahan-kimia";

export const getListDataPenggunaanBahanKimia = async (
  id_petugas: number | undefined,
  tanggal: string | undefined,
  jenis: string | undefined
): Promise<ListDataPenggunaanBahanKimiaResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListDataPenggunaanBahanKimiaResponse>(
    "/mobile/penggunaan-bahan-kimia/list-data",
    {
      headers: {
        token: token,
      },
      params: {
        id_petugas,
        tanggal,
        jenis
      },
    }
  );
  return response.data;
};

export const listDataPenggunaanBahanKimiaQuery = (
  id_petugas: number | undefined,
  tanggal: string | undefined,
  jenis: string | undefined
) =>
  queryOptions({
    queryKey: ["listDataPenggunaanBahanKimiaQuery", id_petugas, tanggal,jenis],
    queryFn: () => getListDataPenggunaanBahanKimia(id_petugas, tanggal,jenis),
    retry: false,
    staleTime: 0,
  });
