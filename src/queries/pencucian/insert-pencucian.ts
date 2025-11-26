import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertPencucianRequest } from "../../types/requests/pencucian/insert-cuci";

export const insertPencucian = async (data: InsertPencucianRequest) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/pencucian/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
