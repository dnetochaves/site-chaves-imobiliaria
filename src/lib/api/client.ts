import createClient from "openapi-fetch";
import type { paths } from "@/lib/api/generated/schema";
import { env } from "@/config/env";
import { getTokens } from "@/lib/auth/tokens";

/**
 * Client de API tipado — os tipos de request/response vêm de
 * src/lib/api/generated/schema.ts (gerado via `npm run api:types` a
 * partir do OpenAPI spec do backend). Ver src/lib/api/README.md.
 */
export const apiClient = createClient<paths>({
  baseUrl: env.apiBaseUrl,
});

/**
 * Anexa o token da sessão atual (se houver) em toda chamada — necessário
 * pros endpoints autenticados (auth/me, favoritos, agendamento de visita
 * etc). Chamadas públicas continuam funcionando normalmente sem o header.
 */
apiClient.use({
  onRequest({ request }) {
    const tokens = getTokens();
    if (tokens) {
      request.headers.set("Authorization", `Bearer ${tokens.accessToken}`);
    }
    return request;
  },
});
