import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/health");
      if (error) throw error;
      return data;
    },
  });
}
