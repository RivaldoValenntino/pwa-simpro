import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { DetailCipoletyResponse } from "../../types/responses/cipolety/detail-data";

export const getDetailCipolety = async (
  id: number,
  kode_trans: string | undefined
): Promise<DetailCipoletyResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<DetailCipoletyResponse>(
    "/mobile/cipolety/detail",
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

export const DetailCipoletyQuery = (
  id: number,
  kode_trans: string | undefined
) =>
  queryOptions({
    queryKey: ["DetailCipoletyQuery", id, kode_trans],
    queryFn: () => getDetailCipolety(id, kode_trans),
    retry: false,
    staleTime: 0,
  });
