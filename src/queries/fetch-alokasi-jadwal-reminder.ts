import { queryOptions } from "@tanstack/react-query";
import { api } from "../libs/api";
import { useAuthStore } from "../store/auth";
import type { ListAlokasiJadwalReminderRes } from "../types/responses/fetch-alokasi-reminder";

export const getListDataAlokasiJadwalReminder = async (
  id_installasi: number | undefined
): Promise<ListAlokasiJadwalReminderRes> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListAlokasiJadwalReminderRes>(
    "/mobile/fetch-alokasi-jadwal",
    {
      headers: {
        token: token,
        },
        params: {
            id_installasi
        }
    }
  );
  return response.data;
};

export const listAlokasiJadwalReminderQuery = (
   id_installasi: number | undefined
) =>
  queryOptions({
    queryKey: [
      "listAlokasiJadwalReminderQuery",
    ],
    queryFn: () =>
        getListDataAlokasiJadwalReminder(
         id_installasi
      ),
    retry: false,
    staleTime: 0,
  });
