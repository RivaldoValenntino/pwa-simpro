import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertMeterPLNRequest } from "../../types/requests/meter-pln/insert-meter-pln";

export const insertMeterPlnData = async (data: InsertMeterPLNRequest) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/meter-pln/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
