import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertDosisRequest } from "../../types/requests/dosis/insert-dosis";

export const insertDosisData = async (data: InsertDosisRequest) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/dosis/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
