import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertSungaiRequest } from "../../types/requests/sungai/insert-sungai";

export const insertSungaiData = async (data: InsertSungaiRequest) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/intake-sungai/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
