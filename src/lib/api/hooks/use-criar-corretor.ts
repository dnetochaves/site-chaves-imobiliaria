import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/generated/schema";

type CorretorCreate = components["schemas"]["CorretorCreate"];

export function useCriarCorretor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CorretorCreate) => {
      const { data, error, response } = await apiClient.POST("/corretores", {
        body: payload,
      });
      if (error) throw toApiError(error, response);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corretores"] });
    },
  });
}
