import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { GetPreviousDataResponse } from "../../types/responses/reservoar/get-previous-data";

export const getDataDosisSebelumnya = async (
  id: number
): Promise<GetPreviousDataResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<GetPreviousDataResponse>(
    "/mobile/reservoar/get-data-sebelumnya",
    {
      headers: {
        token: token,
      },
      params: {
        id,
      },
    }
  );
  return response.data;
};

export const DataDosisSebelumnyaQuery = (id: number) =>
  queryOptions({
    queryKey: ["DataDosisSebelumnyaQuery", id],
    queryFn: () => getDataDosisSebelumnya(id),
    retry: false,
    staleTime: 0,
  });
