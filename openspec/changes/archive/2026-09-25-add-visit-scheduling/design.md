## Context

O backend expõe (já em produção, conferido no `openapi.json`): `GET /imoveis/{imovel_id}/visitas/disponiveis?dias&limite` (público, `[{id, data_hora}]`, 404 se o imóvel não existe ou não está publicado), `POST /visitas/{visita_id}/agendar` (login; corpo opcional `{telefone?, observacoes?}`; erros com `error.code`), `GET /visitas/minhas?status&limit&offset` e `POST /visitas/{id}/cancelar` (400/403/404 como `http_error`, sem código específico). A API só trabalha com instantes ISO 8601 com offset; a referência de exibição é `America/Bahia`. Não há aviso automático de reserva.

No site: `describeApiError` nunca repassa o `message` em inglês e só trata 429; o login (`AuthContext.login()`) redireciona para o backend sem guardar origem e o callback (`AuthCallbackContent`) sempre faz `router.replace("/")`; o Header tem a lista única `accountLinks`; `PropertyPriceSidebar` (sticky no desktop) tem `ContactRequestDialog` e o WhatsApp; `visita-labels.ts` formata datas no fuso do navegador. Ver proposal.md para motivação e escopo.

## Goals / Non-Goals

**Goals:**
- Reserva de ponta a ponta no site, com erros claros em português, e página para acompanhar e cancelar.
- Login que devolve o usuário à página de origem, sem abrir brecha de redirecionamento.

**Non-Goals:**
- Painel da equipe (change seguinte), notificações, reagendar, calendário visual, duração do horário.
- Guardar o horário escolhido durante o login (ver decisão 3).

## Decisions

### 1. Onde a seção fica na página do imóvel
Uma seção "Agendar visita" na coluna principal (depois de "Sobre o imóvel"), com âncora `#agendar-visita`, e um botão principal "Agendar visita" na barra lateral que rola até ela. A lista de horários pode ser longa e a barra lateral é `sticky` no desktop; dentro dela a lista estouraria a altura da tela. O "Pedir contato" passa a botão secundário (`outline`) e o WhatsApp continua. Alternativa (lista dentro da barra lateral) rejeitada pela altura variável.

### 2. Horário sempre em Salvador
Helpers em `src/lib/visita-labels.ts` (ou módulo próprio) usando `Intl.DateTimeFormat("pt-BR", { timeZone: "America/Bahia", ... })`: dia (`quinta-feira, 01/10`), hora (`14:00`) e data+hora completa, mais uma chave de agrupamento por dia calculada no mesmo fuso (não `toISOString().slice(0,10)`, que agruparia no UTC). Os dados da API são instantes, então a conversão é só na exibição. A seção mostra um aviso discreto "Horários de Salvador". O painel continua no fuso do navegador (será revisto na change do painel), por isso o helper novo é separado de `formatVisitaDataHora`.

### 3. Fluxo de reserva e login
Estado local da seção: `slotSelecionado`. Sem login, escolher um horário mostra "Entrar para agendar" (chama `login()`, que guarda a página atual); depois do login volta para a mesma página e o visitante escolhe de novo. Não guardamos o horário escolhido: ele pode ter sido tomado, e guardá-lo exigiria estado extra no `sessionStorage` e revalidação. Com login, aparece o formulário (telefone `type="tel"`, obrigatório, `maxLength` 30; observações opcionais) e "Confirmar". O telefone é validado no cliente só para "obrigatório e ≤ 30" (a API valida o resto; erro 422 com `details[].field === "telefone"` marca o campo). No sucesso: confirmação (data/hora em Salvador + endereço + link Minhas visitas), a escolha é limpa e as queries `["visitas-disponiveis", imovelId]` e `["visitas-minhas"]` são invalidadas.

### 4. Retorno pós-login (`src/lib/auth/return-to.ts`)
- `login()` chama `saveReturnTo()`: lê `pathname + search`, e só grava em `sessionStorage` (chave dedicada, em `try/catch`) se `isSafeReturnPath(caminho)`; se o caminho atual não for seguro (ex.: `/auth/callback`), não sobrescreve um destino já guardado.
- O callback chama `consumeReturnTo()`: lê e remove a chave, e devolve o destino somente se `isSafeReturnPath`, senão `"/"`.
- `isSafeReturnPath`: começa com `/`, não começa com `//` nem `/\`, não começa com `/auth/` e não contém quebras de linha; qualquer outra coisa cai na Home. Isso evita open redirect (o valor vem de `sessionStorage`, que pode ser adulterado por script da mesma origem, mas ainda assim é validado antes de navegar com `router.replace`).
- Melhora automaticamente `/anunciar` e `/admin`, que já chamam `login()` nos guards.
- Risco: o `sessionStorage` é por aba; se o navegador abrir o login em outra aba, o retorno cai na Home. Aceitável (comportamento anterior).

### 5. Mensagens de erro por código (`src/lib/visita-errors.ts`)
`describeApiError` só serve para 429. Novo módulo com `describeAgendarError(error)` (mapa `error.code → texto`: `visita_indisponivel`, `visita_no_passado`, `imovel_nao_publicado`, `visita_conflito_horario`, `visita_ja_agendada_no_imovel`, mais status 401 → sessão expirada, 422 `validation_error` → telefone, 429 → delega ao `describeApiError`, resto → genérico) e `describeCancelarError(error)` por status HTTP (400/403/404, pois o backend não dá código). Nunca usa `message`. Devolve também uma "ação sugerida" (`recarregar`, `login`, `ver-minhas-visitas`) para a tela decidir o que fazer. Alternativa (estender `describeApiError` com mapa global de códigos) rejeitada: misturaria mensagens de domínios diferentes num helper genérico.

### 6. Hooks (`src/lib/api/hooks/`)
`useVisitasDisponiveis(imovelId)` (query `["visitas-disponiveis", imovelId]`, `dias=30`, `limite=50`; 4xx sem retry pelo `shouldRetryQuery`), `useAgendarVisita()` (mutation com `{visitaId, telefone, observacoes}`; envia o corpo sempre com `telefone` preenchido), `useMinhasVisitas({status, limit, offset})` (chave `["visitas-minhas", params]`, habilitada só quando autenticado) e `useCancelarVisita()` (invalida `["visitas-minhas"]` e `["visitas-disponiveis"]`, já que um horário cancelado pode voltar a ficar livre). A resposta do `agendar` traz `observacoes` (nota interna da equipe): nunca é exibida.

### 7. Minhas visitas (`/minhas-visitas`)
Guard igual ao de `/anunciar` (carregando → "Carregando…"; não autenticado → `login()` com retorno). Duas abas (estado local): "Próximas" (`status=agendada`) e "Todas"; trocar aba volta à página 1; paginação com `limit=20` como no painel de leads. Cada visita: data/hora em Salvador, rótulo de status (`VISITA_STATUS_OPTIONS`), endereço da `unidade`, título com link para `/imoveis/{id}` só se `imovel` não for `null`, e "Cancelar visita" (só para `agendada`) que abre um `Dialog` de confirmação; erros do cancelamento por status, mostrados na própria linha/diálogo, com status mantido. Botão de cancelar e abas com 44px no mobile.

### 8. Header
Adicionar `{ label: "Minhas visitas", href: "/minhas-visitas" }` ao `accountLinks` do `Header` (só autenticado), de modo que desktop e menu mobile herdam. Risco de largura: em 768–~1000px a barra ganha mais um item; a verificação inclui 768px e 1024px e, se apertar, esconder o texto "Olá, …" abaixo de `lg` (o nome continua no menu mobile).

### 9. Tipos e compatibilidade
`npm run api:types` regenera `schema.ts` a partir de produção. `VisitaRead` ganha `visitante_telefone`/`visitante_observacoes`; as telas do painel (`add-admin-visitas`) continuam compilando. `POST /visitas` passa a exigir `data_hora` com offset; o painel já envia `toISOString()` (termina em `Z`), sem mudança.

## Risks / Trade-offs

- [Verificar com login Google real e reserva real não é possível pelo assistente] → proxy de teste simulando `/auth/me` e os endpoints de visita (sem escrever em produção); a tela do Google não é automatizável, então o salvamento da origem e o consumo no callback são verificados diretamente; o restante fica para o usuário confirmar ponta a ponta.
- [Sem aviso automático da reserva, a equipe pode não ver a visita] → limitação do backend, documentada; o telefone obrigatório ajuda a equipe a confirmar quando olhar o painel.
- [Corrida entre dois usuários no mesmo horário] → o backend garante um vencedor (409 `visita_indisponivel`); o site recarrega a lista.
- [Fuso do visitante diferente do de Salvador] → sempre exibido em Salvador, com aviso na seção.
- [Header mais cheio em telas médias] → verificado em 768px e 1024px, com plano B descrito acima.
