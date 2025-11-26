import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertPemakaianKantorRequest } from "../../types/requests/pemakaian-kantor/insert-pemakaian-kantor";

export const insertPemakaianMeterKantorData = async (
  data: InsertPemakaianKantorRequest
) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/pemakaian-kantor/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
