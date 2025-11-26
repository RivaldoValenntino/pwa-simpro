import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { LastActivityResponse } from "../../types/responses/last-activity";

export const getLastActivity = async (
  id_petugas: number | undefined
): Promise<LastActivityResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<LastActivityResponse>(
    "/mobile/last-activity",
    {
      headers: {
        token: token,
      },
      params: {
        id_petugas,
      },
    }
  );
  return response.data;
};

export const fetchLastActivity = (id_petugas: number | undefined) =>
  queryOptions({
    queryKey: ["fetchLastActivity", id_petugas],
    queryFn: () => getLastActivity(id_petugas),
    retry: false,
    staleTime: 0,
    enabled: !!id_petugas,
  });
