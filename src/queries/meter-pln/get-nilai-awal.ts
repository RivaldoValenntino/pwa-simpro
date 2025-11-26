import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { NilaiAwalMterPlnResponse } from "../../types/responses/meter-pln/get-nilai-awal";

export const getNilaiAwalPln = async ({
  id_installasi,
  tanggal,
  kode_trans,
  jam,
  id_meter,
  type,
}: {
  id_installasi?: number;
  tanggal?: string;
  kode_trans?: string;
  jam: number;
  id_meter: number;
  type: string;
}): Promise<NilaiAwalMterPlnResponse> => {
  const token = useAuthStore.getState().token;

  const response = await api.get<NilaiAwalMterPlnResponse>(
    "/mobile/meter-pln/get-nilai-awal",
    {
      headers: {
        token: token,
      },
      params: {
        tanggal,
        kode_trans,
        id_installasi,
        jam,
        id_meter,
        type,
      },
    }
  );

  return response.data;
};

// Fungsi query untuk TanStack Query
export const NilaiAwalPlnQuery = (
  id_installasi?: number,
  tanggal?: string,
  kode_trans?: string,
  jam?: number,
  id_meter?: number,
  type?: string
) =>
  queryOptions({
    queryKey: [
      "NilaiAwalPlnQuery",
      id_installasi,
      tanggal,
      kode_trans,
      jam,
      id_meter,
      type,
    ],
    queryFn: () =>
      getNilaiAwalPln({
        id_installasi,
        tanggal,
        kode_trans,
        jam: jam ?? 0, // Default fallback
        id_meter: id_meter ?? 0,
        type: type ?? "",
      }),
    retry: false,
    staleTime: 0,
  });
