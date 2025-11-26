import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertKimiaRequest } from "../../types/requests/kimia/insert-kimia";

export const insertKimiaData = async (data: InsertKimiaRequest) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/kimia/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
