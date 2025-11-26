import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { DetailReservoarResponse } from "../../types/responses/reservoar/detail-rsv";

export const getDetailRsv = async (
  id: number,
  kode_trans: string | undefined,
  id_child: number | undefined,
  jam: number | undefined,
  id_trans: number | undefined
): Promise<DetailReservoarResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<DetailReservoarResponse>(
    "/mobile/reservoar/detail",
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

export const DetailReservoarQuery = (
  id: number,
  kode_trans: string | undefined,
  id_child: number | undefined,
  jam: number | undefined,
  id_trans: number | undefined
) =>
  queryOptions({
    queryKey: ["DetailReservoarQuery", id, kode_trans, id_child, jam, id_trans],
    queryFn: () => getDetailRsv(id, kode_trans, id_child, jam, id_trans),
    retry: false,
    staleTime: 0,
  });
