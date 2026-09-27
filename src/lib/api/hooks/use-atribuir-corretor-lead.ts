import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";

/** Ver use-atribuir-corretor-imovel.ts: mesmo padrão, aplicado a leads. */
export function useAtribuirCorretorLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      corretorId,
      leadId,
    }: {
      corretorId: number;
      leadId: number;
    }) => {
      const { data, error, response } = await apiClient.POST(
        "/corretores/{corretor_id}/leads/{lead_id}",
        { params: { path: { corretor_id: corretorId, lead_id: leadId } } },
      );
      if (error) throw toApiError(error, response);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useRemoverCorretorLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      corretorId,
      leadId,
    }: {
      corretorId: number;
      leadId: number;
    }) => {
      const { data, error, response } = await apiClient.DELETE(
        "/corretores/{corretor_id}/leads/{lead_id}",
        { params: { path: { corretor_id: corretorId, lead_id: leadId } } },
      );
      if (error) throw toApiError(error, response);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
