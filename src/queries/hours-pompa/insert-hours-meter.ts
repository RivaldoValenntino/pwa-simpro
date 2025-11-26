import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertHoursPompaRequest } from "../../types/requests/hours-pompa/insert-hours-pompa";

export const insertHoursMeterPompaData = async (data: InsertHoursPompaRequest) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/hours-pompa/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
