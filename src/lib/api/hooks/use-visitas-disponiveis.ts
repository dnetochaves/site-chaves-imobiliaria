import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";

export function useVisitasDisponiveis(imovelId: number) {
  return useQuery({
    queryKey: ["visitas-disponiveis", imovelId],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET(
        "/imoveis/{imovel_id}/visitas/disponiveis",
        {
          params: {
            path: { imovel_id: imovelId },
            query: { dias: 30, limite: 50 },
          },
        },
      );
      if (error) throw toApiError(error, response);
      return data;
    },
  });
}
