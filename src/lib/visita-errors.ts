import { ApiError, describeApiError } from "@/lib/api/errors";

export type AcaoSugerida = "recarregar" | "login" | "ver-minhas-visitas";

export type VisitaErro = {
  mensagem: string;
  acao?: AcaoSugerida;
  campo?: "telefone";
};

const MENSAGEM_TELEFONE = "Informe um telefone válido (até 30 caracteres).";

const POR_CODIGO: Record<string, VisitaErro> = {
  visita_indisponivel: {
    mensagem: "Esse horário acabou de ser reservado. Escolha outro.",
    acao: "recarregar",
  },
  visita_no_passado: {
    mensagem: "Esse horário já passou. Escolha outro.",
    acao: "recarregar",
  },
  imovel_nao_publicado: {
    mensagem: "Este imóvel não está mais disponível.",
  },
  visita_conflito_horario: {
    mensagem: "Você já tem uma visita nesse horário.",
  },
  visita_ja_agendada_no_imovel: {
    mensagem: "Você já tem uma visita agendada neste imóvel.",
    acao: "ver-minhas-visitas",
  },
};

const GENERICA_AGENDAR =
  "Não foi possível agendar a visita agora. Tente novamente em instantes.";

export function describeAgendarError(error: unknown): VisitaErro {
  if (!(error instanceof ApiError)) return { mensagem: GENERICA_AGENDAR };

  const porCodigo = POR_CODIGO[error.code];
  if (porCodigo) return porCodigo;

  if (error.status === 401) {
    return {
      mensagem: "Sua sessão expirou. Entre novamente para agendar.",
      acao: "login",
    };
  }

  if (error.status === 422) {
    const doTelefone = error.details.some((d) => d.field.includes("telefone"));
    return {
      mensagem: doTelefone ? MENSAGEM_TELEFONE : GENERICA_AGENDAR,
      campo: doTelefone ? "telefone" : undefined,
    };
  }

  if (error.status === 404) {
    return {
      mensagem: "Esse horário não existe mais. Escolha outro.",
      acao: "recarregar",
    };
  }

  return { mensagem: describeApiError(error, GENERICA_AGENDAR) };
}

const GENERICA_CANCELAR =
  "Não foi possível cancelar a visita agora. Tente novamente em instantes.";

export function describeCancelarError(error: unknown): string {
  if (!(error instanceof ApiError)) return GENERICA_CANCELAR;

  if (error.status === 400) return "Essa visita não pode mais ser cancelada.";
  if (error.status === 403) return "Você não pode cancelar essa visita.";
  if (error.status === 404) return "Visita não encontrada.";
  if (error.status === 401) {
    return "Sua sessão expirou. Entre novamente para cancelar.";
  }

  return describeApiError(error, GENERICA_CANCELAR);
}

const GENERICA_CONCLUIR =
  "Não foi possível concluir a visita agora. Tente novamente em instantes.";

export function describeConcluirError(error: unknown): string {
  if (!(error instanceof ApiError)) return GENERICA_CONCLUIR;

  if (error.status === 400) {
    return "Essa visita não pode ser concluída no estado atual.";
  }
  if (error.status === 403) return "Você não pode concluir essa visita.";
  if (error.status === 404) return "Visita não encontrada.";
  if (error.status === 401) {
    return "Sua sessão expirou. Entre novamente para concluir.";
  }

  return describeApiError(error, GENERICA_CONCLUIR);
}
