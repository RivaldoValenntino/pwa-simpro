import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { ReferensiMasterResponse } from "../../types/responses/master-ref";

export const getRefMaster = async (
  kode_trans: string | undefined,
  id_installasi: number | undefined
): Promise<ReferensiMasterResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ReferensiMasterResponse>(
    "/mobile/fetch-master-ref",
    {
      headers: {
        token: token,
      },
      params: {
        kode_trans,
        id_installasi,
      },
    }
  );
  return response.data;
};

export const fetchRefMasterQuery = (
  kode_trans: string | undefined,
  id_installasi: number | undefined
) =>
  queryOptions({
    queryKey: ["fetchRefMasterQuery"],
    queryFn: () => getRefMaster(kode_trans, id_installasi),
    retry: false,
    staleTime: 0,
  });
