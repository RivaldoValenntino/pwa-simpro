import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { WtpDebtDataResponse } from "../../types/responses/wtp-debt/list-wtp-debt";

export const getListWtpDebt = async (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number
): Promise<WtpDebtDataResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<WtpDebtDataResponse>(
    "/mobile/wtp-debt/list-data",
    {
      headers: {
        token: token,
      },
      params: {
        tanggal,
        kode_trans,
        id_installasi,
        jam,
      },
    }
  );
  return response.data;
};

export const listWtpDebtQuery = (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number | undefined
) =>
  queryOptions({
    queryKey: ["listWtpDebtQuery", tanggal, kode_trans, id_installasi, jam],
    queryFn: () => getListWtpDebt(tanggal, kode_trans, id_installasi, jam ?? 0),
    retry: false,
    staleTime: 0,
  });
