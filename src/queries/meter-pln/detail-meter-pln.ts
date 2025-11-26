import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { DetailMeterPlnResponse } from "../../types/responses/meter-pln/detail-pln";

export const getDetailMeterPln = async (
  id: number,
  kode_trans: string | undefined,
): Promise<DetailMeterPlnResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<DetailMeterPlnResponse>(
    "/mobile/meter-pln/detail",
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

export const DetailMeterPlnQuery = (
  id: number,
  kode_trans: string | undefined,
) =>
  queryOptions({
    queryKey: ["DetailMeterPlnQuery", id, kode_trans],
    queryFn: () => getDetailMeterPln(id, kode_trans),
    retry: false,
    staleTime: 0,
  });
