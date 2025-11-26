import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { DetailPencucianResponse } from "../../types/responses/pencucian/detail-pencucian";

export const getDetailPencucian = async (
  id: number,
  kode_trans: string | undefined
): Promise<DetailPencucianResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<DetailPencucianResponse>(
    "/mobile/pencucian/detail",
    {
      headers: {
        token: token,
      },
      params: {
        id,
        kode_trans,
      },
    }
  );
  return response.data;
};

export const DetailPencucianQuery = (
  id: number,
  kode_trans: string | undefined
) =>
  queryOptions({
    queryKey: ["DetailPencucianQuery", id, kode_trans],
    queryFn: () => getDetailPencucian(id, kode_trans),
    retry: false,
    staleTime: 0,
  });
