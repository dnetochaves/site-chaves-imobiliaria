## Context

`useAuth()` (`src/lib/auth/AuthContext.tsx`) já expõe `user` (com `is_staff`, vindo de `GET /auth/me`) e `status` (`loading` | `authenticated` | `unauthenticated`). O guard existente em `/anunciar` usa `useAuth` + `login()` quando não autenticado. Os endpoints `POST /imoveis/{id}/aprovar|pausar|rejeitar` exigem staff (403 caso contrário) e devolvem `ImovelDetail`. `GET /imoveis/{id}` deixa staff ver imóveis em qualquer status; `GET /imoveis` (busca pública) só devolve `publicado`. Ver proposal.md para motivação e escopo.

## Goals / Non-Goals

**Goals:**
- Área `/admin` restrita a staff, sem revelar sua existência a quem não é staff.
- Moderação de imóveis (aprovar/pausar/rejeitar) usando só o que a API oferece hoje.

**Non-Goals:**
- Fila de imóveis pendentes (`em_analise`): a API não tem endpoint de listagem para staff. Limitação conhecida; quando o backend expuser esse endpoint, a lista pode ser trocada/estendida sem mudar o guard nem as ações.
- Leads, visitas, condomínios.
- O front não decide quais transições de status são válidas — isso é regra do backend.

## Decisions

### 1. Guard em `src/app/admin/layout.tsx` (client component)
Um único layout protege `/admin` e todas as subrotas, em vez de repetir a checagem em cada página. Comportamento por estado do `useAuth`:
- `loading` → "Carregando…" (evita piscar 404 antes de saber quem é o usuário).
- `unauthenticated` → chama `login()` (mesmo padrão de `/anunciar`) e mostra "Carregando…".
- `authenticated` e `!user.is_staff` → `notFound()` do Next (404 padrão do app). Escolha: não revelar que o painel existe; alternativa (mensagem "Acesso negado") rejeitada pelo usuário.
- `authenticated` e `user.is_staff` → renderiza `children` dentro de uma casca simples (título "Painel administrativo" e navegação mínima).

### 2. O guard é só UX; a segurança é a API
Esconder o link e bloquear a tela evita confusão, mas não protege nada por si só: um usuário mal-intencionado pode chamar a API direto. O que impede ações de não-staff é o 403 do backend. O front trata 403 nas ações como qualquer erro de API (mensagem via `describeApiError`).

### 3. Estrutura de rotas
- `/admin` — lista de imóveis publicados (reusa `useImoveis`) + campo "abrir imóvel por ID".
- `/admin/imoveis/[imovelId]` — tela de moderação: reusa `useImovelDetail` (mostra título, endereço, status) e os botões Aprovar / Pausar / Rejeitar.
Alternativa considerada: mostrar a moderação num modal a partir da lista — rejeitada porque imóveis não publicados só são alcançáveis por ID, e uma rota própria permite abrir/compartilhar o link direto.

### 4. Hooks de ação
Um hook por ação (`use-aprovar-imovel`, `use-pausar-imovel`, `use-rejeitar-imovel`) ou um único `useModerarImovel(acao)` — mesmo padrão de `use-create-imovel.ts` (`useMutation` + `toApiError`). No sucesso, atualizam `["imovel", id]` com o `ImovelDetail` retornado e invalidam `["imoveis"]` (a lista de publicados muda). Decisão de implementação: um hook único parametrizado pela ação, pois as três chamadas diferem só no path.

### 5. Botões de ação: sempre os três, sem regra de transição no front
Mostrar sempre Aprovar / Pausar / Rejeitar e deixar a API recusar transições inválidas, exibindo uma mensagem pt-BR (via `describeApiError`, que por convenção do projeto nunca repassa o texto em inglês da API) dizendo que a ação pode não ser permitida para o status atual. Esconder botões por status exigiria copiar regras de negócio do backend para o front (risco de divergir). Durante uma ação em andamento, os botões ficam desabilitados.

### 6. Link "Admin" no Header
`Header.tsx` renderiza o link quando `status === "authenticated" && user?.is_staff === true`, no mesmo bloco/padrão do link "Favoritos".

### 7. Campo "abrir por ID"
Input numérico + botão; valida inteiro positivo antes de navegar para `/admin/imoveis/{id}`; ID inválido não navega e mostra mensagem. ID inexistente é tratado na tela de destino (`ImovelNaoEncontradoError` do `useImovelDetail` → "Imóvel não encontrado").

## Risks / Trade-offs

- [Não dá pra achar imóveis pendentes sem saber o ID] → Limitação da API, documentada; a equipe precisa do ID (ex.: enviado após o cadastro). Resolver pedindo o endpoint de listagem ao backend.
- [Sem regra de transição no front, o staff pode clicar em ação inválida] → A API recusa e a mensagem de erro é exibida; status exibido não muda.
- [Verificação ponta a ponta exige login Google staff, que o assistente não consegue fazer] → Verificar por harness isolado dos componentes e/ou pelo próprio usuário com uma conta staff.
