import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import type { components } from "@/lib/api/generated/schema";

type FavoritoRead = components["schemas"]["FavoritoRead"];
type UnidadeRead = components["schemas"]["UnidadeRead"];

const FAVORITOS_QUERY_KEY = ["favoritos"];

export function useFavoritos() {
  const { status } = useAuth();
  return useQuery({
    queryKey: FAVORITOS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/favoritos");
      if (error) throw error;
      return data;
    },
    enabled: status === "authenticated",
  });
}

export function useToggleFavorito(unidade: UnidadeRead) {
  const queryClient = useQueryClient();
  const { data: favoritos } = useFavoritos();
  const isFavorito =
    favoritos?.some((favorito) => favorito.unidade.id === unidade.id) ?? false;

  const mutation = useMutation({
    mutationFn: async (next: boolean) => {
      const { error } = next
        ? await apiClient.POST("/favoritos/{unidade_id}", {
            params: { path: { unidade_id: unidade.id } },
          })
        : await apiClient.DELETE("/favoritos/{unidade_id}", {
            params: { path: { unidade_id: unidade.id } },
          });
      if (error) throw error;
    },
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: FAVORITOS_QUERY_KEY });
      const previous =
        queryClient.getQueryData<FavoritoRead[]>(FAVORITOS_QUERY_KEY);
      queryClient.setQueryData<FavoritoRead[]>(
        FAVORITOS_QUERY_KEY,
        (old = []) =>
          next
            ? [...old, { id: -1, unidade, imovel_atual: null }]
            : old.filter((favorito) => favorito.unidade.id !== unidade.id),
      );
      return { previous };
    },
    onError: (_err, _next, context) => {
      // `setQueryData` ignora um valor `undefined` (não limpa o cache), por
      // isso o fallback explícito pra `[]` — sem isso, uma mutação que falha
      // antes do primeiro fetch de `/favoritos` ter resolvido deixaria a
      // entrada otimista presa no cache pra sempre.
      queryClient.setQueryData(FAVORITOS_QUERY_KEY, context?.previous ?? []);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITOS_QUERY_KEY });
    },
  });

  return {
    isFavorito,
    toggle: () => mutation.mutate(!isFavorito),
    isPending: mutation.isPending,
  };
}
