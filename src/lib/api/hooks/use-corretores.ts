import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";

export function useCorretores({ ativo }: { ativo?: boolean } = {}) {
  return useQuery({
    queryKey: ["corretores", { ativo }],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/corretores", {
        params: { query: { ativo } },
      });
      if (error) throw toApiError(error, response);
      return data;
    },
  });
}
