import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertReservoarRequest } from "../../types/requests/reservoar/insert-rsv";

export const insertReservoarData = async (data: InsertReservoarRequest) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/reservoar/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
