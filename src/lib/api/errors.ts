import type { components } from "@/lib/api/generated/schema";

type ErrorBody = components["schemas"]["ErrorBody"];

export type ApiErrorDetail = { field: string; message: string };

/**
 * Erro padronizado da API: `{ error: { code, message, details } }`. Também
 * cobre falhas fora desse formato (rede, 502 de proxy com HTML, corpo vazio),
 * que viram `code: "unknown_error"` — quem consome não precisa tratar
 * `undefined`/objeto cru. Ver design.md do change handle-api-error-format.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: ApiErrorDetail[];
  readonly retryAfterSeconds: number | null;

  constructor(init: {
    status: number;
    code: string;
    message: string;
    details?: ApiErrorDetail[];
    retryAfterSeconds?: number | null;
  }) {
    super(init.message);
    this.name = "ApiError";
    this.status = init.status;
    this.code = init.code;
    this.details = init.details ?? [];
    this.retryAfterSeconds = init.retryAfterSeconds ?? null;
  }
}

function isErrorBody(value: unknown): value is ErrorBody {
  if (typeof value !== "object" || value === null) return false;
  const body = value as Record<string, unknown>;
  return typeof body.code === "string" && typeof body.message === "string";
}

/** `Retry-After` em segundos (formato de data HTTP é ignorado: a API envia segundos). */
function parseRetryAfter(header: string | null): number | null {
  if (header === null || !/^\d+$/.test(header.trim())) return null;
  return Number(header.trim());
}

export function toApiError(error: unknown, response: Response): ApiError {
  const retryAfterSeconds = parseRetryAfter(
    response.headers.get("Retry-After"),
  );
  const inner =
    typeof error === "object" && error !== null && "error" in error
      ? (error as { error: unknown }).error
      : undefined;

  if (isErrorBody(inner)) {
    return new ApiError({
      status: response.status,
      code: inner.code,
      message: inner.message,
      details: Array.isArray(inner.details) ? inner.details : [],
      retryAfterSeconds,
    });
  }

  return new ApiError({
    status: response.status,
    code: "unknown_error",
    message: `Unexpected API error (HTTP ${response.status})`,
    retryAfterSeconds,
  });
}

const GENERIC_MESSAGE =
  "Não foi possível concluir a operação agora. Tente novamente em instantes.";

/**
 * Texto pt-BR pronto para a interface. Nunca repassa o `message` em inglês do
 * back-end. `fallback` é o texto da própria tela (ex.: "Não foi possível
 * carregar os imóveis...") usado quando o erro não tem uma mensagem mais
 * específica. Com `showValidationDetails`, erros de validação mostram as
 * mensagens de `details` (que descrevem o campo com problema) — só faz
 * sentido em formulários, onde o usuário pode corrigir o dado.
 */
export function describeApiError(
  error: unknown,
  fallback: string = GENERIC_MESSAGE,
  options: { showValidationDetails?: boolean } = {},
): string {
  if (!(error instanceof ApiError)) return fallback;

  if (error.status === 429) {
    return error.retryAfterSeconds !== null
      ? `Muitas tentativas. Tente de novo em ${error.retryAfterSeconds} segundos.`
      : "Muitas tentativas. Aguarde um pouco e tente de novo.";
  }

  if (
    options.showValidationDetails &&
    error.code === "validation_error" &&
    error.details.length > 0
  ) {
    return error.details.map((detail) => detail.message).join(" ");
  }

  return fallback;
}
