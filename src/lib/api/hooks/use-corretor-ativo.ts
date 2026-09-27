import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";

function enviar(rota: "desativar" | "reativar", corretorId: number) {
  const init = { params: { path: { corretor_id: corretorId } } };
  return rota === "desativar"
    ? apiClient.POST("/corretores/{corretor_id}/desativar", init)
    : apiClient.POST("/corretores/{corretor_id}/reativar", init);
}

function useAlterarCorretorAtivo(rota: "desativar" | "reativar") {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (corretorId: number) => {
      const { data, error, response } = await enviar(rota, corretorId);
      if (error) throw toApiError(error, response);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corretores"] });
    },
  });
}

export function useDesativarCorretor() {
  return useAlterarCorretorAtivo("desativar");
}

export function useReativarCorretor() {
  return useAlterarCorretorAtivo("reativar");
}
