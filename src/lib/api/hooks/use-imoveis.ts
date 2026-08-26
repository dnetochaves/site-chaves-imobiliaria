import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { paths } from "@/lib/api/generated/schema";

type SearchImoveisParams = NonNullable<
  paths["/imoveis"]["get"]["parameters"]["query"]
>;

export function useImoveis(params: SearchImoveisParams = {}) {
  return useQuery({
    queryKey: ["imoveis", params],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/imoveis", {
        params: { query: params },
      });
      if (error) throw error;
      return data;
    },
  });
}
