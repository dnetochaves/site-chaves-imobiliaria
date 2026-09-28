import { ApiError, describeApiError } from "@/lib/api/errors";

const GENERICA_CADASTRO =
  "Não foi possível salvar o corretor agora. Tente novamente em instantes.";

/**
 * Erro do formulário de criar/editar corretor. A API responde 409 tanto pra
 * CRECI duplicado quanto pra slug duplicado, sem indicar qual — por isso
 * quem chama informa quais desses dois campos foram alterados nesta
 * submissão (`camposAlterados`), pra associar o erro ao campo certo. Quando
 * os dois mudaram (ou nenhum, caso inesperado), a mensagem cobre as duas
 * possibilidades sem apontar um campo específico.
 */
export function describeCorretorError(
  error: unknown,
  camposAlterados: { creci?: boolean; slug?: boolean } = {},
): { mensagem: string; campo?: "creci" | "slug" } {
  if (!(error instanceof ApiError)) return { mensagem: GENERICA_CADASTRO };

  if (error.status === 409) {
    const { creci, slug } = camposAlterados;
    if (slug && !creci) {
      return {
        mensagem: "Esse slug já está em uso por outro corretor.",
        campo: "slug",
      };
    }
    if (creci && !slug) {
      return {
        mensagem: "Já existe um corretor com este CRECI nesta UF.",
        campo: "creci",
      };
    }
    return {
      mensagem:
        "Já existe um corretor com este CRECI ou com este slug. Confira os dois campos.",
    };
  }

  return {
    mensagem: describeApiError(error, GENERICA_CADASTRO, {
      showValidationDetails: true,
    }),
  };
}

const GENERICA_ATIVO =
  "Não foi possível alterar o status do corretor agora. Tente novamente em instantes.";

export function describeCorretorAtivoError(error: unknown): string {
  if (!(error instanceof ApiError)) return GENERICA_ATIVO;
  if (error.status === 404) return "Corretor não encontrado.";
  return describeApiError(error, GENERICA_ATIVO);
}

const GENERICA_ATRIBUICAO =
  "Não foi possível atribuir o corretor agora. Tente novamente em instantes.";

/** Erro do seletor de atribuição (imóvel ou lead). */
export function describeAtribuicaoCorretorError(error: unknown): string {
  if (!(error instanceof ApiError)) return GENERICA_ATRIBUICAO;

  if (error.status === 409) {
    return "Este corretor está inativo; reative-o antes de atribuir.";
  }
  if (error.status === 404) return "Corretor não encontrado.";

  return describeApiError(error, GENERICA_ATRIBUICAO);
}
