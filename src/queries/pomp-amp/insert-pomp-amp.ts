import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertPompAmpRequest } from "../../types/requests/pomp-amp/insert-pomp-amp";

export const insertPompAmp = async (data: InsertPompAmpRequest) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/pomp-amp/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
