import createClient from "openapi-fetch";
import type { paths } from "@/lib/api/generated/schema";
import { env } from "@/config/env";

/**
 * Client de API tipado — os tipos de request/response vêm de
 * src/lib/api/generated/schema.ts (gerado via `npm run api:types` a
 * partir do OpenAPI spec do backend). Ver src/lib/api/README.md.
 */
export const apiClient = createClient<paths>({
  baseUrl: env.apiBaseUrl,
});
