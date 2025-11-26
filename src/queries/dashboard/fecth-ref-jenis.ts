import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { RefJenisResponse } from "../../types/responses/ref-jenis-trans";
export const getRefJenisTrans = async (
  jam: number,
  tanggal: string | undefined
): Promise<RefJenisResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<RefJenisResponse>("/mobile/fetch-ref-jenis", {
    headers: {
      token: token,
    },
    params: {
      id_installasi: useAuthStore.getState().user?.id_installasi,
      tanggal: tanggal || new Date().toISOString().split("T")[0],
      jam: jam || new Date().getHours(),
      // tanggal: "2025-08-04",
      // jam: 14,
    },
  });
  return response.data;
};

export const fetchRefJenisQuery = (jam: number, tanggal: string | undefined) =>
  queryOptions({
    queryKey: ["fetchRefJenisQuery", jam, tanggal],
    queryFn: () => getRefJenisTrans(jam, tanggal),
    retry: false,
  });
