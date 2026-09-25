import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { paths } from "@/lib/api/generated/schema";

type MinhasVisitasParams = NonNullable<
  paths["/visitas/minhas"]["get"]["parameters"]["query"]
>;

export function useMinhasVisitas(
  params: MinhasVisitasParams,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ["visitas-minhas", params],
    enabled: options.enabled ?? true,
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/visitas/minhas", {
        params: { query: params },
      });
      if (error) throw toApiError(error, response);
      return data;
    },
  });
}
