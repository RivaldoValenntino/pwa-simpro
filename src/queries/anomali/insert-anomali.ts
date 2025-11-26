import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertAnomaliRequest } from "../../types/requests/trans-anomali/insert-anomali";

export const insertTransAnomali = async (data: InsertAnomaliRequest) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/trans-anomali/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
