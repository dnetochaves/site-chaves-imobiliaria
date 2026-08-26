# lib/api

Camada de acesso à API do backend Chaves Imobiliária.

- `generated/` — tipos gerados a partir do `openapi.json` do backend (via `npm run api:types`). Não editar manualmente.
- `hooks/` — hooks de TanStack Query que usam o client tipado para buscar/mutar dados.
- `client.ts` — wrapper fino de `fetch` tipado, usa `NEXT_PUBLIC_API_BASE_URL` como base.
