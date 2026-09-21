import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";

export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/health");
      if (error) throw toApiError(error, response);
      return data;
    },
  });
}
