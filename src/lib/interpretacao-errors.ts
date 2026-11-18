import { ApiError, describeApiError } from "@/lib/api/errors";

export type InterpretacaoErro = {
  mensagem: string;
  /** Texto recusado pelo servidor: a mensagem aparece junto ao campo. */
  noCampo?: boolean;
  /** O recurso não está disponível neste ambiente: a tela desabilita "Interpretar". */
  desabilita?: boolean;
  /** Sessão expirada: levar ao login. */
  login?: boolean;
};

const INDISPONIVEL = "Não foi possível interpretar o texto agora. Tente novamente em instantes ou cadastre manualmente.";

/** A mensagem da API é em inglês e nunca é repassada: tudo sai do `code`/status. */
export function describeInterpretacaoError(error: unknown): InterpretacaoErro {
  if (!(error instanceof ApiError)) return { mensagem: INDISPONIVEL };

  if (error.code === "texto_sem_dados_de_imovel") {
    return {
      mensagem:
        "Não encontramos um anúncio de imóvel nesse texto. Confira o que foi colado ou cadastre manualmente.",
    };
  }
  if (error.code === "interpretacao_nao_configurada") {
    return {
      mensagem:
        "A interpretação de texto não está disponível no momento. Use o cadastro manual.",
      desabilita: true,
    };
  }
  if (error.code === "interpretacao_indisponivel") {
    return { mensagem: INDISPONIVEL };
  }
  if (error.status === 429) {
    return { mensagem: describeApiError(error) };
  }
  if (error.status === 401) {
    return {
      mensagem: "Sua sessão expirou. Entre novamente para continuar.",
      login: true,
    };
  }
  if (error.status === 403) {
    return { mensagem: "Você não tem permissão para usar este recurso." };
  }
  if (error.status === 422 && error.code === "validation_error") {
    return {
      mensagem: "O texto está vazio ou passa do limite de 6000 caracteres.",
      noCampo: true,
    };
  }
  return { mensagem: describeApiError(error, INDISPONIVEL) };
}

export type SeveridadeAviso = "alta" | "normal";

const AVISOS_ALTA = new Set([
  "total_divergente",
  "possivel_duplicado",
  "codigo_ja_cadastrado",
  "endereco_na_descricao",
  "valor_sem_lastro",
]);

/** O conjunto de códigos é aberto: um desconhecido é "normal" e exibido com a mensagem. */
export function severidadeDoAviso(codigo: string): SeveridadeAviso {
  return AVISOS_ALTA.has(codigo) ? "alta" : "normal";
}
