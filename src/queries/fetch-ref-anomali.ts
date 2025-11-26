import { queryOptions } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth";
import { api } from "../libs/api";
import type { RefAnomaliResponse } from "../types/responses/fetch-ref-anomali";

export const getListRefAnomali = async (): Promise<RefAnomaliResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<RefAnomaliResponse>(
    "/mobile/fetch-ref-anomali",
    {
      headers: {
        token: token,
      },
    }
  );
  return response.data;
};

export const listRefAnomaliQuery = () =>
  queryOptions({
    queryKey: ["listRefAnomaliQuery"],
    queryFn: () => getListRefAnomali(),
    retry: false,
    staleTime: 0,
  });
