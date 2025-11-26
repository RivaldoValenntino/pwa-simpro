import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertGensetRequest } from "../../types/requests/trans-genset/insert-genset";

export const insertGensetData = async (data: InsertGensetRequest) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/trans-genset/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
