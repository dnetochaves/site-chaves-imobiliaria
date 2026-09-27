import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/generated/schema";

type CorretorUpdate = components["schemas"]["CorretorUpdate"];

export function useAtualizarCorretor(corretorId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CorretorUpdate) => {
      const { data, error, response } = await apiClient.PATCH(
        "/corretores/{corretor_id}",
        {
          params: { path: { corretor_id: corretorId } },
          body: payload,
        },
      );
      if (error) throw toApiError(error, response);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corretores"] });
    },
  });
}
