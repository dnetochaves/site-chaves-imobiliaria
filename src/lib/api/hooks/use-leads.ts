import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { paths } from "@/lib/api/generated/schema";

type ListLeadsParams = NonNullable<
  paths["/leads"]["get"]["parameters"]["query"]
>;

export function useLeads(params: ListLeadsParams = {}) {
  return useQuery({
    queryKey: ["leads", params],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/leads", {
        params: { query: params },
      });
      if (error) throw toApiError(error, response);
      return data;
    },
  });
}
