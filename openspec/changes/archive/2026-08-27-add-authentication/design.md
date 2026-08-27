## Context

Ver [proposal.md](proposal.md) para o porquê. Fluxo OAuth confirmado com o backend (ver proposal): login redireciona pro backend → backend troca código com o provedor → backend redireciona pro frontend em `/auth/callback?code=...` → frontend troca o código por tokens via `POST /auth/exchange`. Endpoints confirmados no schema gerado (`src/lib/api/generated/schema.ts`): `/auth/{provider}/login`, `/auth/exchange`, `/auth/refresh`, `/auth/logout`, `/auth/me`. O projeto já tem `apiClient` (`src/lib/api/client.ts`, openapi-fetch) e `Header`/`Footer` (`add-site-shell`).

## Goals / Non-Goals

**Goals:**
- Fluxo de login/logout funcional ponta a ponta.
- Sessão validada/renovada automaticamente ao carregar o app.
- Header reflete o estado de autenticação.

**Non-Goals:**
- Funcionalidades que dependem de autenticação (favoritos, agendar visita, página de detalhe do imóvel) — changes futuros.
- Múltiplos provedores OAuth.
- Preservar a página de origem antes do login.
- Retry automático de refresh em qualquer chamada de API que receba 401 — só o carregamento inicial do app tenta renovar a sessão (ver Decisão 6). Uma chamada feita no meio de uma sessão cujo token expirou vai falhar com 401; tratar isso de forma mais robusta (interceptor global de retry) fica para um change futuro se se mostrar necessário na prática.
- UI de perfil além do nome no header.

## Decisions

**1. Único provedor OAuth: `"google"`, hardcoded no botão de login.**
O schema não expõe um enum de providers (é um path param livre). Sem outra informação, assumir Google é razoável para um MVP brasileiro. Se um segundo provedor for necessário, é uma mudança pequena e isolada (trocar a URL do botão de login, ou listar mais de um botão).

**2. "Entrar" e "Criar conta" viram um único CTA de login.**
Como a API é 100% OAuth (o backend cria o usuário no primeiro login, confirmado na descrição do endpoint de callback), não existe uma ação de "criar conta" distinta de "entrar" — as duas eram, na prática, o mesmo destino já no change `add-site-shell` (ambas eram links placeholder). Um único botão ("Entrar") remove a duplicação sem perder nenhuma capacidade.

**3. Tokens salvos em `localStorage`, isolados atrás de `src/lib/auth/tokens.ts`.**
O fluxo do backend não oferece cookies httpOnly nesta etapa — devolve os tokens como JSON pro frontend guardar "como preferir" (confirmado com o usuário). `localStorage` é a opção mais simples e comum para esse tipo de fluxo. Isolar o acesso num módulo próprio (`getTokens`/`setTokens`/`clearTokens`) deixa fácil trocar de mecanismo de armazenamento depois sem tocar no resto do código.

**4. Estado de sessão via React Context (`AuthProvider`) em `src/app/providers.tsx`, ao lado do `QueryClientProvider` já existente.**
Expõe `{ user, status: "loading" | "authenticated" | "unauthenticated", login, logout }`. `login()` faz `window.location.href = "{API_BASE}/auth/google/login"` (redirect de página inteira, não fetch — é assim que o fluxo OAuth funciona). `logout()` chama `POST /auth/logout` (best-effort) e limpa tokens/estado local.

**5. Client de API ganha um middleware de `openapi-fetch` (`apiClient.use(...)`) que anexa `Authorization: Bearer {access_token}` quando há uma sessão ativa.**
`openapi-fetch` já suporta middleware nativamente (`onRequest`), não precisa de biblioteca nova. O middleware só anexa o header quando o token existe — não bloqueia chamadas públicas.

**6. Validação de sessão ao carregar o app: `GET /auth/me` → se 401, `POST /auth/refresh` uma vez → se falhar de novo, limpa a sessão.**
Só esse caminho (carregamento inicial) tenta renovar automaticamente. Chamadas feitas durante o uso normal do app não têm retry automático de refresh embutido (ver Non-Goals) — decisão consciente pra não construir um interceptor genérico de retry sem um caso de uso real ainda.

**7. `/auth/callback` é uma rota real e funcional (não um placeholder 404), em `src/app/auth/callback/page.tsx`.**
Lê `code` de `useSearchParams()`, chama `/auth/exchange`, atualiza o `AuthProvider`, redireciona pra `/`. Em caso de erro (código ausente/inválido/expirado), mostra uma mensagem de erro com um link pra tentar login de novo — não faz redirect automático (evitaria mascarar o erro numa tela que passa rápido demais pra ler).

**8. Header consome `AuthProvider` e alterna entre CTA de login e "Olá, {nome}" + botão "Sair" — sem menu dropdown.**
`UserRead.name` pode ser `null`; nesse caso usa o e-mail como fallback de exibição.

## Risks / Trade-offs

- **[Risco] Tokens em `localStorage` são acessíveis via XSS** → Mitigação parcial: nenhuma mitigação adicional nesta fase (aceito conscientemente, documentado); revisitar se o backend passar a oferecer cookies httpOnly no futuro.
- **[Risco] Suposição do provedor "google" pode estar errada** → Mitigação: mudança isolada e barata de corrigir (é só a URL do botão de login), não compromete a arquitetura da capability.
- **[Trade-off] Sem retry automático de refresh em chamadas do meio da sessão** → Aceito; o usuário nesse caso só perceberia uma chamada falhando (401) até recarregar a página, o que dispara a validação completa de novo.

## Open Questions

Nenhuma pendente que afete specs, abordagem ou tasks deste change.
