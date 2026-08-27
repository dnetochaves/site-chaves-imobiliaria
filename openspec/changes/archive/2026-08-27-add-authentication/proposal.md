## Why

Ao analisar o schema da API pra montar a página de detalhe do imóvel, descobrimos que o backend já expõe endpoints reais de favoritos (`/favoritos`) e agendamento de visita (`/visitas/{id}/agendar`) — mas ambos exigem um usuário autenticado, e o projeto ainda não tem nenhum fluxo de login. Hoje o Header (`add-site-shell`) tem "Entrar"/"Criar conta" como links placeholder que dão 404. Sem autenticação, essas funcionalidades reais da API (e a própria página de detalhe do imóvel, que depende delas para "Agendar visita" fazer algo de verdade) ficam bloqueadas. Este change implementa a autenticação como pré-requisito, seguindo o fluxo OAuth já confirmado com o time de backend.

## What Changes

- Implementar o fluxo de login OAuth completo: o Header redireciona o navegador para `GET {API_BASE}/auth/google/login`; após o usuário autorizar no Google e o backend processar o callback, ele redireciona para uma nova rota do frontend, `/auth/callback?code=...`, que troca o código pelos tokens via `POST /auth/exchange`.
- Guardar os tokens (`access_token`, `refresh_token`) e expor um estado de sessão global (usuário autenticado ou não) para o resto da aplicação.
- Anexar `Authorization: Bearer {access_token}` automaticamente nas chamadas do client de API (`src/lib/api/client.ts`) para endpoints autenticados.
- Ao carregar o app, validar uma sessão existente via `GET /auth/me`; se o token expirou, tentar `POST /auth/refresh` uma vez antes de considerar o usuário deslogado.
- Implementar logout real (`POST /auth/logout`), limpando os tokens e o estado de sessão.
- Atualizar o Header: "Entrar"/"Criar conta" (mesma ação, já que a API é 100% OAuth e cria o usuário no primeiro login) viram um único CTA de login quando deslogado; quando autenticado, mostram o nome do usuário + botão "Sair".

**Fora de escopo**: qualquer funcionalidade que dependa de estar autenticado (favoritar de verdade, agendar visita de verdade, página de detalhe do imóvel) — fica para changes futuros que já podem assumir que a autenticação existe. Múltiplos provedores OAuth. Preservar a página de origem antes do login (o fluxo atual do backend não dá suporte a isso). Qualquer UI de perfil além do nome no header.

## Capabilities

### New Capabilities
- `authentication`: login via OAuth, troca de código por tokens, sessão (estado autenticado/deslogado, validação/refresh ao carregar o app), logout, e chamadas de API autenticadas.

### Modified Capabilities
- `site-shell`: o header reflete o estado de autenticação (CTA de login quando deslogado; nome do usuário + logout quando autenticado), substituindo os links placeholder "Entrar"/"Criar conta".

## Impact

- **Código**: nova rota `src/app/auth/callback/page.tsx`; novo módulo de sessão (ex. `src/lib/auth/`); `src/lib/api/client.ts` ganha middleware de autenticação; `src/components/shell/Header.tsx` revisado; `src/app/providers.tsx` ganha um `AuthProvider`.
- **API consumida**: `GET /auth/{provider}/login`, `POST /auth/exchange`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me` — todos já existentes, nenhum endpoint novo a pedir ao backend.
- **Dependências**: nenhuma nova.
- **Segurança**: tokens em `localStorage` (não há opção de cookie httpOnly nesse fluxo) — risco de exposição a XSS aceito nesta fase, documentado em design.md.
