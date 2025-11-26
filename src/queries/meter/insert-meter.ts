import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertMeterRequest } from "../../types/requests/meter/insert-meter";

export const insertMeterData = async (data: InsertMeterRequest) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/meter-produksi/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
