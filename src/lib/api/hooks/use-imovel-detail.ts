import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export class ImovelNaoEncontradoError extends Error {}

export function useImovelDetail(imovelId: number) {
  return useQuery({
    queryKey: ["imovel", imovelId],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET(
        "/imoveis/{imovel_id}",
        { params: { path: { imovel_id: imovelId } } },
      );
      if (error) {
        if (response.status === 404) throw new ImovelNaoEncontradoError();
        throw error;
      }
      return data;
    },
    retry: (failureCount, error) =>
      error instanceof ImovelNaoEncontradoError ? false : failureCount < 3,
  });
}
