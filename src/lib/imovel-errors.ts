import { ApiError, describeApiError } from "@/lib/api/errors";

const GENERICA =
  "Não foi possível executar a ação. Tente novamente em instantes.";

export const MENSAGEM_UNIDADE_ATIVA =
  "Esta unidade já tem outro anúncio ativo (em análise ou publicado).";

/** O texto da API é em inglês e nunca é repassado: a mensagem sai do `error.code`. */
export function isTransicaoInvalida(error: unknown): boolean {
  return error instanceof ApiError && error.code === "transicao_invalida";
}

export function describeImovelAcaoError(error: unknown): string {
  if (!(error instanceof ApiError)) return GENERICA;

  if (error.code === "transicao_invalida") {
    return "Este imóvel mudou de status. Atualizando a lista.";
  }
  if (error.code === "unidade_ja_tem_anuncio_ativo") {
    return MENSAGEM_UNIDADE_ATIVA;
  }
  if (error.status === 404) return "Imóvel não encontrado.";
  if (error.status === 401) {
    return "Sua sessão expirou. Entre novamente para continuar.";
  }
  if (error.status === 403) return "Você não tem permissão para esta ação.";

  return describeApiError(error, GENERICA);
}
