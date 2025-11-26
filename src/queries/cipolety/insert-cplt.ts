import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertCipoletyRequests } from "../../types/requests/cipolety/insert-cplt";

export const InsertCipoletyData = async (data: InsertCipoletyRequests) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/cipolety/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
