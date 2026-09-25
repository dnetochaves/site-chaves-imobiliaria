import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";

type AgendarVariables = {
  visitaId: number;
  telefone: string;
  observacoes?: string;
};

export function useAgendarVisita(imovelId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ visitaId, telefone, observacoes }: AgendarVariables) => {
      const { data, error, response } = await apiClient.POST(
        "/visitas/{visita_id}/agendar",
        {
          params: { path: { visita_id: visitaId } },
          body: { telefone, observacoes: observacoes || undefined },
        },
      );
      if (error) throw toApiError(error, response);
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["visitas-disponiveis", imovelId],
      });
      queryClient.invalidateQueries({ queryKey: ["visitas-minhas"] });
    },
  });
}
