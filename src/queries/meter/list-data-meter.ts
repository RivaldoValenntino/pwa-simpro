import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { ListMeterResponse } from "../../types/responses/meter/list-meter";

export const getLisDataMeter = async (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number,
  jenis: string | undefined
): Promise<ListMeterResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListMeterResponse>(
    "/mobile/meter-produksi/list-data",
    {
      headers: {
        token: token,
      },
      params: {
        tanggal,
        kode_trans,
        id_installasi,
        jam,
        jenis,
      },
    }
  );
  return response.data;
};

export const listDataMeterQuery = (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number | undefined,
  jenis: string | undefined
) =>
  queryOptions({
    queryKey: [
      "listDataMeterQuery",
      tanggal,
      kode_trans,
      id_installasi,
      jam,
      jenis,
    ],
    queryFn: () =>
      getLisDataMeter(tanggal, kode_trans, id_installasi, jam ?? 0, jenis),
    retry: false,
    staleTime: 0,
  });
