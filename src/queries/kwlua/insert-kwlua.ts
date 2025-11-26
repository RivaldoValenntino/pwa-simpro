import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertKwluaRequest } from "../../types/requests/kwlua/insert-kwlua";

export const insertKwluaData = async (data: InsertKwluaRequest) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/kwlua/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
