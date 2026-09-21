import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/generated/schema";

type LeadCreate = components["schemas"]["LeadCreate"];

export function useCreateLead() {
  return useMutation({
    mutationFn: async (payload: LeadCreate) => {
      const { data, error, response } = await apiClient.POST("/leads", {
        body: payload,
      });
      if (error) throw toApiError(error, response);
      return data;
    },
  });
}
