## Context

O painel `/admin` (changes `add-admin-panel` e `add-admin-leads`) já tem guard por `is_staff`, navegação em `src/app/admin/layout.tsx`, o campo "abrir por ID" com validação de inteiro positivo, e o padrão de ações com `useMutation` + `toApiError` + `describeApiError`. A API de visitas expõe `POST /visitas` (staff, cria horário; 201 → `VisitaRead`; 404 se a unidade não existe), `POST /visitas/{id}/cancelar` e `POST /visitas/{id}/concluir` (200 → `VisitaRead`; 404 se a visita não existe). Não há endpoint de listagem nem de consulta de visitas. Ver proposal.md para motivação e escopo.

## Goals / Non-Goals

**Goals:**
- Equipe cria horários de visita conferindo o imóvel antes, e cancela/conclui visitas pelo ID, sem chamar a API à mão.

**Non-Goals:**
- Listagem/histórico/calendário de visitas, editar ou remover horários, agendar visita (`/agendar`), lista "próximas 48h" e qualquer mudança no site público.
- Regras de negócio no front (antecedência mínima, transições de status, quem pode cancelar/concluir): a API decide e o front mostra o resultado.

## Decisions

### 1. Uma página, duas seções; navegação com lógica de ativo explícita
Rota `/admin/visitas` com as seções "Criar horário de visita" e "Cancelar ou concluir visita". O layout ganha o terceiro link. A lógica de item ativo hoje é "Imóveis está ativo se o caminho não começa com `/admin/leads`", que quebra com uma terceira seção; passa a ser explícita: cada seção declara seus prefixos (Imóveis: `/admin` exato e `/admin/imoveis`; Leads: `/admin/leads`; Visitas: `/admin/visitas`), e o link fica ativo se o caminho é igual ao prefixo ou começa com o prefixo + `/`.

### 2. Criar horário: resolver o imóvel para a unidade
A API pede `unidade_id`, que é diferente do ID do imóvel. A equipe informa o ID do imóvel; a página valida inteiro positivo, busca com `useImovelDetail` (habilitado só depois de confirmar o ID) e mostra título e endereço. A criação usa `imovel.unidade.id`. Se o imóvel não existe (`ImovelNaoEncontradoError`), mostra "Imóvel não encontrado" e não permite criar. Alternativa (digitar o `unidade_id` direto) rejeitada pelo usuário por facilitar confundir os dois IDs. Como `useImovelDetail` recebe um número e sempre consulta, a página só chama o hook depois do ID confirmado (componente filho renderizado condicionalmente com o ID confirmado).

### 3. Data e hora
`<input type="datetime-local">` (hora local do navegador, obrigatório). Ao enviar: `new Date(valor).toISOString()`, isto é, o instante correspondente à hora local escolhida, em UTC. Na confirmação, o horário retornado é exibido em pt-BR (`toLocaleString("pt-BR")`) no fuso do navegador. Sem validação de antecedência mínima no front. Risco documentado: se o fuso do navegador da equipe não for o do imóvel, o horário pode não ser o pretendido — a confirmação mostra o horário para conferência.

### 4. Cancelar/concluir por ID sem consulta prévia
Campo de ID (inteiro positivo) e dois botões: "Cancelar visita" e "Concluir visita". Não há como consultar a visita antes; só o resultado devolvido é exibido (ID, data/hora, status). O ID vem da confirmação de criação (que o painel destaca para a equipe copiar/usar). Botões desabilitados durante a ação.

### 5. Hooks
`useCriarHorarioVisita()` (`POST /visitas`) e `useAtualizarVisita()` — um hook parametrizado por ação (`cancelar` | `concluir`) recebendo o `visitaId` na chamada de `mutate`, porque o ID é digitado (não conhecido na montagem), diferente de `useModerarImovel(imovelId)`. Mesmo padrão: `useMutation` + `toApiError`. Sem cache a invalidar (não há query de visitas).

### 6. Rótulos de status
`src/lib/visita-labels.ts` com `VISITA_STATUS_OPTIONS` (`disponivel` → "Disponível", `agendada` → "Agendada", `concluida` → "Concluída", `cancelada` → "Cancelada"), mesmo padrão de `lead-labels.ts`.

### 7. Mensagens de erro
`describeApiError` com fallbacks pt-BR por operação. 404 é tratado à parte na tela (`ApiError.status === 404`): na criação, "unidade/imóvel não encontrado"; em cancelar/concluir, "Visita não encontrada." Demais erros: fallback "Não foi possível <criar o horário / cancelar / concluir> a visita. A ação pode não ser permitida para o estado atual." Na criação, os dados preenchidos são mantidos (estado local não é limpo no erro).

### 8. Segurança
O guard é só UX; o 403 da API é a proteção real (erros 401/403 caem no fallback de erro em português).

## Risks / Trade-offs

- [Sem listagem, a equipe depende de guardar o ID da visita] → limitação da API, documentada; a confirmação da criação destaca o ID. Resolver pedindo ao backend um endpoint de listagem.
- [Fuso horário do navegador vs. do imóvel] → confirmação mostra o horário resultante; sem tratamento de fuso do imóvel.
- [Ação em ID errado] → sem consulta prévia não há conferência; a API valida permissão/estado e o resultado é exibido para a equipe verificar.
