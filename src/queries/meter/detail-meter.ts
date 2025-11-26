import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { DetailMeterResponse } from "../../types/responses/meter/detail-meter";

export const getDetailMeter = async (
  id: number,
  kode_trans: string | undefined,
  id_child: number | undefined,
  jam: number | undefined,
  id_trans: number | undefined
): Promise<DetailMeterResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<DetailMeterResponse>(
    "/mobile/meter-produksi/detail",
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

export const DetailMeterQuery = (
  id: number,
  kode_trans: string | undefined,
  id_child: number | undefined,
  jam: number | undefined,
  id_trans: number | undefined
) =>
  queryOptions({
    queryKey: ["DetailMeterQuery", id, kode_trans, id_child, jam, id_trans],
    queryFn: () => getDetailMeter(id, kode_trans, id_child, jam, id_trans),
    retry: false,
    staleTime: 0,
  });
