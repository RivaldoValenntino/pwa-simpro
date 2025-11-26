import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { DetailKimiaResponse } from "../../types/responses/kimia/detail-kimia";

export const getDetailKimia = async (
  id: number,
  kode_trans: string | undefined
): Promise<DetailKimiaResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<DetailKimiaResponse>("/mobile/kimia/detail", {
    headers: {
      token: token,
    },
    params: {
      id,
      kode_trans,
    },
  });
  return response.data;
};

export const DetailKimiaQuery = (id: number, kode_trans: string | undefined) =>
  queryOptions({
    queryKey: ["DetailKimiaQuery", id, kode_trans],
    queryFn: () => getDetailKimia(id, kode_trans),
    retry: false,
    staleTime: 0,
  });
