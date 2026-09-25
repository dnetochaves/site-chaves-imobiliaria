import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";

export function useCancelarVisita() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (visitaId: number) => {
      const { data, error, response } = await apiClient.POST(
        "/visitas/{visita_id}/cancelar",
        { params: { path: { visita_id: visitaId } } },
      );
      if (error) throw toApiError(error, response);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitas-minhas"] });
      queryClient.invalidateQueries({ queryKey: ["visitas-disponiveis"] });
    },
  });
}
