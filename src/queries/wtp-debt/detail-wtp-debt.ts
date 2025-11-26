import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { WtpDebtResponse } from "../../types/responses/wtp-debt/detail-wtp-debt";

export const getDetailWtpDebt = async (
  id: number,
  kode_trans: string | undefined,
  id_child: number | undefined,
  jam: number | undefined,
  id_trans: number | undefined
): Promise<WtpDebtResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<WtpDebtResponse>("/mobile/wtp-debt/detail", {
    headers: {
      token: token,
    },
    params: {
      id,
      kode_trans,
      id_child,
      jam,
      id_trans,
    },
  });
  return response.data;
};

export const DetailWtpDebtQuery = (
  id: number,
  kode_trans: string | undefined,
  id_child: number | undefined,
  jam: number | undefined,
  id_trans: number | undefined
) =>
  queryOptions({
    queryKey: ["DetailWtpDebtQuery", id, kode_trans, id_child, jam, id_trans],
    queryFn: () => getDetailWtpDebt(id, kode_trans, id_child, jam, id_trans),
    retry: false,
    staleTime: 0,
  });
