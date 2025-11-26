import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { InsertBahanKimiaRequest } from "../../types/requests/bahan-kimia/insert-bahan-kimia";

export const insertPenggunaanBahanKimia = async (
  data: InsertBahanKimiaRequest
) => {
  const token = useAuthStore.getState().token;
  const response = await api.post(
    "/mobile/penggunaan-bahan-kimia/insert",
    data,
    {
      headers: {
        token: token,
      },
    }
  );

  return response.data;
};
