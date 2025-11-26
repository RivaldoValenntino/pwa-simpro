import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { PompaAmpereDetailResponse } from "../../types/responses/pomp-amp/detail-data-pomp-amp";

export const getDetailPompAmp = async (
  id: number,
  kode_trans: string | undefined
): Promise<PompaAmpereDetailResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<PompaAmpereDetailResponse>(
    "/mobile/pomp-amp/detail",
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

export const DetailPompAmpQuery = (
  id: number,
  kode_trans: string | undefined
) =>
  queryOptions({
    queryKey: ["DetailPompAmpQuery", id, kode_trans],
    queryFn: () => getDetailPompAmp(id, kode_trans),
    retry: false,
    staleTime: 0,
  });
