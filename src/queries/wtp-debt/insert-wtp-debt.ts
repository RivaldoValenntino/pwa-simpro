import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertWtpDebtRequest } from "../../types/requests/wtp-debt/insert-wtp-debt";

export const insertWtpDebt = async (data: InsertWtpDebtRequest) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/wtp-debt/insert", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
