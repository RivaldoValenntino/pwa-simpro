import { queryOptions } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth";
import { api } from "../libs/api";
import type { ShiftResponse } from "../types/responses/fetch-shift";

export const getShiftPgw = async (
  tanggal: string | undefined
): Promise<ShiftResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ShiftResponse>(
    "/mobile/fetch-shift",
    {
      headers: {
        token: token,
      },
      params: {
        
        tanggal,
      },
    }
  );
  return response.data;
};

export const getShiftPgwQuery = (
  tanggal: string | undefined
) =>
  queryOptions({
    queryKey: ["getShiftPgwQuery", tanggal],
    queryFn: () => getShiftPgw(tanggal),
    retry: false,
    staleTime: 0,
  });
