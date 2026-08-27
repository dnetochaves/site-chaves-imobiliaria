import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export function useVisitasDisponiveisEmBreve() {
  return useQuery({
    queryKey: ["visitas-disponiveis-em-breve"],
    queryFn: async () => {
      const { data, error } = await apiClient.GET(
        "/visitas/disponiveis-em-breve",
      );
      if (error) throw error;
      return data;
    },
  });
}
