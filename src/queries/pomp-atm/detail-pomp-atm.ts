import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { PompaTekananKolektorDetailResponse } from "../../types/responses/pomp-atm/detail-pomp-atm";

export const getDetailPompAtm = async (
  id: number,
  kode_trans: string | undefined,
  id_child: number | undefined,
  jam: number | undefined,
  id_trans: number | undefined
): Promise<PompaTekananKolektorDetailResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<PompaTekananKolektorDetailResponse>(
    "/mobile/pomp-atm/detail",
    {
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
    }
  );
  return response.data;
};

export const DetailPompAtmQuery = (
  id: number,
  kode_trans: string | undefined,
  id_child: number | undefined,
  jam: number | undefined,
  id_trans: number | undefined
) =>
  queryOptions({
    queryKey: ["DetailPompAtmQuery", id, kode_trans, id_child, jam, id_trans],
    queryFn: () => getDetailPompAtm(id, kode_trans, id_child, jam, id_trans),
    retry: false,
    staleTime: 0,
  });
