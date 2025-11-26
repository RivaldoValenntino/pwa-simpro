import { queryOptions } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth";
import { api } from "../../libs/api";
import type { GetStandAwalMeterKantorResponse } from "../../types/responses/pemakaian-kantor/get-stand-awal";

export const getStandAwalMeterKantor = async (
  id_installasi: number | undefined,
  id_meter: number | null,
  tanggal?: string
): Promise<GetStandAwalMeterKantorResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<GetStandAwalMeterKantorResponse>(
    "/mobile/pemakaian-kantor/get-stand-awal",
    {
      headers: {
        token: token,
      },
      params: {
        id_installasi,
        id_meter,
        tanggal,
      },
    }
  );
  return response.data;
};

export const getStandAwalMeterKantorQuery = (
  id_installasi: number | undefined,
  id_meter: number | null,
  tanggal?: string
) =>
  queryOptions({
    queryKey: [
      "getStandAwalMeterKantorQuery",
      id_installasi,
      id_meter,
      tanggal,
    ],
    queryFn: () => getStandAwalMeterKantor(id_installasi, id_meter, tanggal),
    retry: false,
    staleTime: 0,
  });
