import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { ListDataPompaAmpereResponses } from "../../types/responses/pomp-amp/list-data-pomp-amp";

export const getListPompaAmp = async (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number,
  jenis: string | undefined
): Promise<ListDataPompaAmpereResponses> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListDataPompaAmpereResponses>(
    "/mobile/pomp-amp/list-data",
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

export const listPompaAmpereQuery = (
  tanggal: string | undefined,
  kode_trans: string | undefined,
  id_installasi: number | undefined,
  jam: number | undefined,
  jenis: string | undefined
) =>
  queryOptions({
    queryKey: ["listPompaAmpereQuery", tanggal, kode_trans, id_installasi, jam, jenis ?? ""],
    queryFn: () =>
      getListPompaAmp(tanggal, kode_trans, id_installasi, jam ?? 0, jenis),
    retry: false,
    staleTime: 0,
  });
