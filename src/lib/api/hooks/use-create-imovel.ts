import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { components } from "@/lib/api/generated/schema";

type ImovelSubmissionCreate = components["schemas"]["ImovelSubmissionCreate"];

export function useCreateImovel() {
  return useMutation({
    mutationFn: async (payload: ImovelSubmissionCreate) => {
      const { data, error } = await apiClient.POST("/imoveis", {
        body: payload,
      });
      if (error) throw error;
      return data;
    },
  });
}
