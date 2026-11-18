import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { ApiError, toApiError } from "@/lib/api/errors";

/** O servidor limita a IA em 45 s; a espera do front fica acima disso. */
export const TIMEOUT_INTERPRETACAO_MS = 60_000;

export const LIMITE_TEXTO_INTERPRETACAO = 6000;

/**
 * Interpreta uma mensagem de anúncio colada. Não grava nada: devolve uma
 * proposta de cadastro para revisão. Sem retry (mutação) — o limite de
 * requisições do servidor é baixo e o back-end pede para não repetir sozinho.
 * O texto vai exatamente como foi colado.
 */
export function useInterpretarTexto() {
  return useMutation({
    mutationFn: async (texto: string) => {
      try {
        const { data, error, response } = await apiClient.POST(
          "/admin/imoveis/interpretar-texto",
          {
            body: { texto },
            signal: AbortSignal.timeout(TIMEOUT_INTERPRETACAO_MS),
          },
        );
        if (error) throw toApiError(error, response);
        return data;
      } catch (e) {
        if (e instanceof DOMException && e.name === "TimeoutError") {
          throw new ApiError({
            status: 503,
            code: "interpretacao_indisponivel",
            message: "Interpretation timed out on the client",
          });
        }
        throw e;
      }
    },
  });
}
