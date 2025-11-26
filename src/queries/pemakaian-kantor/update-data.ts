import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { UpdatePemakaianKantorRequest } from "../../types/requests/pemakaian-kantor/update-pemakaian-kantor";

export const updatePemakaianKantorQuery = async (
  data: UpdatePemakaianKantorRequest
) => {
  const token = useAuthStore.getState().token;
  const response = await api.post("/mobile/pemakaian-kantor/update", data, {
    headers: {
      token: token,
    },
  });

  return response.data;
};
