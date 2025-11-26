import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { DetailPencucianChildResponse } from "../../types/responses/pencucian/detail-pencucian-child";

export const getDetailPencucianChild = async (
  id: number,
  jenis: string | undefined
): Promise<DetailPencucianChildResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<DetailPencucianChildResponse>(
    "/mobile/pencucian/detail-child",
    {
      headers: {
        token: token,
      },
      params: {
        id,
        jenis,
      },
    }
  );
  return response.data;
};

export const DetailPencucianChildQuery = (
  id: number,
  jenis: string | undefined
) =>
  queryOptions({
    queryKey: ["DetailPencucianChildQuery", id, jenis],
    queryFn: () => getDetailPencucianChild(id, jenis),
    retry: false,
    staleTime: 0,
  });
