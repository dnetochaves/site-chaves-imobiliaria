## 1. Base compartilhada

- [x] 1.1 Em `src/lib/visita-labels.ts`, criar `salvadorLocalParaIso`, `inicioDoDiaSalvador` e `fimDoDiaSalvador` (America/Bahia via `Intl.formatToParts`, sem fixar o offset, `null` para valor inválido) e remover `formatVisitaDataHora`; verificar por script, com `TZ` em UTC, Asia/Tokyo, America/New_York e America/Sao_Paulo, que `2026-10-05T14:30` resulta em `2026-10-05T17:30:00.000Z` e que início/fim do dia de `2026-10-05` resultam em `...T03:00:00Z` e `2026-10-06T02:59:59Z`
- [x] 1.2 Em `src/lib/visita-errors.ts`, adicionar `describeConcluirError` (por status HTTP, sem usar `message`) e verificar os status 400/401/403/404/500 por script
- [x] 1.3 Criar `useVisitasStaff` em `src/lib/api/hooks/` e fazer `useAtualizarVisita` e `useCriarHorarioVisita` invalidarem `["visitas-staff"]`, `["visitas-minhas"]` e `["visitas-disponiveis"]` no sucesso; `tsc` limpo

## 2. Lista de visitas

- [x] 2.1 Criar a lista em `src/app/admin/visitas/_components/` com filtros de status (inicial "Agendadas"), ID do imóvel (validado, mensagem para inválido) e período de/até (em Salvador, com offset), paginação de 20, contagem e estados carregando / erro / vazio, na ordem recebida da API
- [x] 2.2 Criar `VisitaLinha` com data/hora de Salvador, status em português, imóvel (link para `/admin/imoveis/{id}` ou só endereço), endereço, dados do visitante (nome ou e-mail, e-mail, telefone, observações do visitante) e "Nota da equipe", com rótulos distintos
- [x] 2.3 Adicionar as ações "Concluir" e "Cancelar" só para visitas `agendada`, cada uma com `Dialog` de confirmação (Manter/Confirmar), botões desabilitados durante o envio, erro por status em português e status mantido; botões com 44px no mobile

## 3. Página e criação de horário

- [x] 3.1 Em `src/app/admin/visitas/page.tsx`, colocar a lista antes da criação de horário e remover `AtualizarVisitaSection` (arquivo e uso)
- [x] 3.2 Em `CriarHorarioSection`, rotular o campo como horário de Salvador, enviar por `salvadorLocalParaIso`, exibir a confirmação com `formatDataHoraSalvador` e atualizar a lista ao criar; `tsc`/`eslint` limpos

## 4. Verificação

- [x] 4.1 Recriar um proxy local de teste em Node (`/auth/me` com `staff-token` e `user-token`; `GET /visitas` com filtros por status, `imovel_id`, `de`, `ate` e paginação, com itens livres, agendados com visitante e nota da equipe, e um com `imovel: null`; imóvel inexistente devolvendo página vazia; `POST /visitas` registrando o corpo recebido; `cancelar` (200/400/403/404) e `concluir` (200/400/404); `GET /imoveis/{id}` repassado à produção; qualquer outro POST/PATCH/DELETE bloqueado), apontar `.env.local` para ele e subir o servidor
- [x] 4.2 Lista: abre em "Agendadas"; cada filtro isolado e combinado; `de`/`ate` chegando ao proxy com offset `-03:00` (início e fim do dia); ID de imóvel inválido e inexistente; paginação; vazio e erro; itens livres sem visitante, agendados com todos os dados, e sem imóvel sem link
- [x] 4.3 Ações: Concluir e Cancelar com confirmação, desistir (Manter e X, conferindo `data-state`), botões desabilitados durante o envio, sucesso atualizando a lista, e erros 400/403/404 com a mensagem certa mantendo o status; visitas não agendadas sem ações
- [x] 4.4 Criar horário: o corpo recebido pelo proxy tem o instante certo para o valor digitado (`2026-10-05T14:30` como `17:30Z`), aviso de Salvador visível, confirmação em Salvador e o novo horário aparecendo na lista (filtro "Disponíveis")
- [x] 4.5 Mobile 375px e 320px sem rolagem horizontal, com "Concluir"/"Cancelar" e filtros utilizáveis (ações com 44px); desktop sem regressão
- [x] 4.6 `tsc` e `eslint` limpos no projeto todo; restaurar `.env.local`, parar proxy e servidor e voltar o viewport para desktop; registrar no relatório o que só o usuário confirma com conta staff real e backend real (dados reais em `GET /visitas`, a ordem da lista e as regras de transição de `concluir`)
