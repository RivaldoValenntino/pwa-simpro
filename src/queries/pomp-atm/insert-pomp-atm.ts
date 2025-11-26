import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertPompAtmRequest } from "../../types/requests/pomp-atm/insert-pomp-atm";

export const insertPompAtm = async (data: InsertPompAtmRequest) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/pomp-atm/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
