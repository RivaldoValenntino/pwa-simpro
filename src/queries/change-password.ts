import { AxiosError } from "axios";
import { useAuthStore } from "../store/auth";
import {
  UbahPasswordSchema,
  type UbahPasswordType,
} from "../types/requests/ubah-password";
import { api } from "../libs/api";
import type { SuccessResponse } from "../types/responses/success";
import type { ErrorResponse } from "../types/responses/error";

export const changePasswordUpload = async (
  data: UbahPasswordType
): Promise<SuccessResponse> => {
  const token = useAuthStore.getState().token;
  try {
    UbahPasswordSchema.parse(data);

    const response = await api.post("/mobile/ubah-password", data, {
      headers: {
        token: `${token}`,
      },
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    throw new Error(error.response?.data.message || "Gagal Mengubah Password");
  }
};
