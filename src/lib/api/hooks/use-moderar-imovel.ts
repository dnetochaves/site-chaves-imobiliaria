import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { ListingAction } from "@/lib/imovel-labels";

export type AcaoModeracao = ListingAction;

function enviarAcao(acao: AcaoModeracao, imovelId: number) {
  const init = { params: { path: { imovel_id: imovelId } } };
  switch (acao) {
    case "aprovar":
      return apiClient.POST("/imoveis/{imovel_id}/aprovar", init);
    case "pausar":
      return apiClient.POST("/imoveis/{imovel_id}/pausar", init);
    case "rejeitar":
      return apiClient.POST("/imoveis/{imovel_id}/rejeitar", init);
    case "republicar":
      return apiClient.POST("/imoveis/{imovel_id}/republicar", init);
  }
}

export function useModerarImovel(imovelId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (acao: AcaoModeracao) => {
      const { data, error, response } = await enviarAcao(acao, imovelId);
      if (error) throw toApiError(error, response);
      return data;
    },
    onSuccess: (imovel) => {
      queryClient.setQueryData(["imovel", imovelId], imovel);
      queryClient.invalidateQueries({ queryKey: ["imoveis"] });
      queryClient.invalidateQueries({ queryKey: ["admin-imoveis"] });
    },
    // Em qualquer falha a lista pode estar desatualizada (ex.: outra pessoa da
    // equipe agiu antes), então ela é sempre recarregada.
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-imoveis"] });
    },
  });
}
