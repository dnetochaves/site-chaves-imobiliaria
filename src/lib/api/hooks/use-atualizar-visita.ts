import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";

export type AcaoVisita = "cancelar" | "concluir";

function enviarAcao(acao: AcaoVisita, visitaId: number) {
  const init = { params: { path: { visita_id: visitaId } } };
  return acao === "cancelar"
    ? apiClient.POST("/visitas/{visita_id}/cancelar", init)
    : apiClient.POST("/visitas/{visita_id}/concluir", init);
}

export function useAtualizarVisita() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      acao,
      visitaId,
    }: {
      acao: AcaoVisita;
      visitaId: number;
    }) => {
      const { data, error, response } = await enviarAcao(acao, visitaId);
      if (error) throw toApiError(error, response);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitas-staff"] });
      queryClient.invalidateQueries({ queryKey: ["visitas-minhas"] });
      queryClient.invalidateQueries({ queryKey: ["visitas-disponiveis"] });
    },
  });
}
