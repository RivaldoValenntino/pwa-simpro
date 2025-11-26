import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { UpdateAnomaliRequest } from "../../types/requests/trans-anomali/update-anomali";

export const updateTransAnomali = async (data: UpdateAnomaliRequest) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/trans-anomali/update", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
