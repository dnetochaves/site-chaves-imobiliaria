import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/generated/schema";

type VisitaSlotCreate = components["schemas"]["VisitaSlotCreate"];

export function useCriarHorarioVisita() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: VisitaSlotCreate) => {
      const { data, error, response } = await apiClient.POST("/visitas", {
        body: payload,
      });
      if (error) throw toApiError(error, response);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitas-staff"] });
      queryClient.invalidateQueries({ queryKey: ["visitas-disponiveis"] });
    },
  });
}
