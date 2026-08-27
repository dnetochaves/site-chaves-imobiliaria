import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { components } from "@/lib/api/generated/schema";

type LeadCreate = components["schemas"]["LeadCreate"];

export function useCreateLead() {
  return useMutation({
    mutationFn: async (payload: LeadCreate) => {
      const { data, error } = await apiClient.POST("/leads", {
        body: payload,
      });
      if (error) throw error;
      return data;
    },
  });
}
