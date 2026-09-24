import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { LeadStatus } from "@/lib/lead-labels";

export function useAtualizarStatusLead(leadId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: LeadStatus) => {
      const { data, error, response } = await apiClient.PATCH(
        "/leads/{lead_id}/status",
        {
          params: { path: { lead_id: leadId } },
          body: { status },
        },
      );
      if (error) throw toApiError(error, response);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
