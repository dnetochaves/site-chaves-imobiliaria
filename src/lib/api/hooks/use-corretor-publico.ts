import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";

export class CorretorNaoEncontradoError extends Error {}

export function useCorretorPublico(slug: string) {
  return useQuery({
    queryKey: ["corretor-publico", slug],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET(
        "/corretores/publico/{slug}",
        { params: { path: { slug } } },
      );
      if (error) {
        if (response.status === 404) throw new CorretorNaoEncontradoError();
        throw toApiError(error, response);
      }
      return data;
    },
    retry: (failureCount, error) =>
      error instanceof CorretorNaoEncontradoError ? false : failureCount < 3,
  });
}
