import { ApiError, describeApiError } from "@/lib/api/errors";

const GENERICA_CADASTRO =
  "Não foi possível salvar o corretor agora. Tente novamente em instantes.";

/**
 * Erro do formulário de criar/editar corretor. O 409 de CRECI duplicado vira
 * um campo próprio (`campo: "creci"`), pra ser exibido junto dos inputs de
 * CRECI em vez de como mensagem genérica do formulário.
 */
export function describeCorretorError(
  error: unknown,
): { mensagem: string; campo?: "creci" } {
  if (!(error instanceof ApiError)) return { mensagem: GENERICA_CADASTRO };

  if (error.status === 409) {
    return {
      mensagem: "Já existe um corretor com este CRECI nesta UF.",
      campo: "creci",
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
