import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { paths } from "@/lib/api/generated/schema";

export type AdminImoveisParams = NonNullable<
  paths["/admin/imoveis"]["get"]["parameters"]["query"]
>;

export function useAdminImoveis(params: AdminImoveisParams = {}) {
  return useQuery({
    queryKey: ["admin-imoveis", params],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/admin/imoveis", {
        params: { query: params },
      });
      if (error) throw toApiError(error, response);
      return data;
    },
  });
}
