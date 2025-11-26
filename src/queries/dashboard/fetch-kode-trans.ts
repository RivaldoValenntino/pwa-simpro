import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { RefJenisResponse } from "../../types/responses/ref-jenis-trans";

export const getRefKodeTransDashboard = async (): Promise<RefJenisResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<RefJenisResponse>("/mobile/fetch-ref-kode", {
    headers: {
      token: token,
    },
    params: {},
  });
  return response.data;
};

export const fetchRefKodeQuery = () =>
  queryOptions({
    queryKey: ["fetchRefKodeQuery"],
    queryFn: () => getRefKodeTransDashboard(),
    retry: false,
  });
