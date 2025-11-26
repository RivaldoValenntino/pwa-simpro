import { queryOptions } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { useAuthStore } from "../../store/auth";
import type { ListRefPompaResponse } from "../../types/responses/hours-pompa/list-ref-pompa";

export const getListRefPompa = async (
  id_installasi: number | undefined,
): Promise<ListRefPompaResponse> => {
  const token = useAuthStore.getState().token;
  const response = await api.get<ListRefPompaResponse>(
    "/mobile/hours-pompa/list-ref-pompa",
    {
      headers: {
        token: token,
      },
      params: {
        id_installasi,
      },
    }
  );
  return response.data;
};

export const listDataRefPompaQuery = (
  id_installasi: number | undefined,
) =>
  queryOptions({
    queryKey: ["listDataRefPompaQuery",  id_installasi],
    queryFn: () =>
      getListRefPompa(id_installasi),
    retry: false,
    staleTime: 0,
  });
