import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { DetailSungaiResponse } from "../../types/responses/sungai/detail-sungai";

export const getDetailSungai = async (
  id: number,
  kode_trans: string | undefined,
  id_child: number | undefined,
  jam: number | undefined,
  id_trans: number | undefined
): Promise<DetailSungaiResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<DetailSungaiResponse>(
    "/mobile/meter-produksi/detail",
    {
      headers: {
        token: token,
      },
      params: {
        id,
        kode_trans,
        id_child,
        jam,
        id_trans,
      },
    }
  );
  return response.data;
};

export const DetailSungaiQuery = (
  id: number,
  kode_trans: string | undefined,
  id_child: number | undefined,
  jam: number | undefined,
  id_trans: number | undefined
) =>
  queryOptions({
    queryKey: ["DetailSungaiQuery", id, kode_trans, id_child, jam, id_trans],
    queryFn: () => getDetailSungai(id, kode_trans, id_child, jam, id_trans),
    retry: false,
    staleTime: 0,
  });
