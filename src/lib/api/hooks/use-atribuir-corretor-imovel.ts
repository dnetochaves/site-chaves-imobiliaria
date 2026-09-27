import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";

/**
 * Atribuir e remover são duas mutações separadas (em vez de uma só recebendo
 * `corretorId | null`): remover exige o id do corretor atualmente atribuído,
 * que o chamador (o seletor) já tem em mãos via `corretorAtual`.
 */
export function useAtribuirCorretorImovel(imovelId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (corretorId: number) => {
      const { data, error, response } = await apiClient.POST(
        "/corretores/{corretor_id}/imoveis/{imovel_id}",
        { params: { path: { corretor_id: corretorId, imovel_id: imovelId } } },
      );
      if (error) throw toApiError(error, response);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imovel", imovelId] });
      queryClient.invalidateQueries({ queryKey: ["imoveis"] });
    },
  });
}

export function useRemoverCorretorImovel(imovelId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (corretorId: number) => {
      const { data, error, response } = await apiClient.DELETE(
        "/corretores/{corretor_id}/imoveis/{imovel_id}",
        { params: { path: { corretor_id: corretorId, imovel_id: imovelId } } },
      );
      if (error) throw toApiError(error, response);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imovel", imovelId] });
      queryClient.invalidateQueries({ queryKey: ["imoveis"] });
    },
  });
}
