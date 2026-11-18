## Context

A lista de imóveis do painel (`ImoveisAdminLista`/`ImovelAdminLinha`) já mostra um botão por valor de `acoes_permitidas` e confirma só pausar e rejeitar (change `update-admin-imoveis`). `ImovelAdminRead` já traz `verificado`. O back-end ainda não tem rota para alterar `verificado`; o pedido (rotas `verificar`/`desverificar` e as duas novas ações em `acoes_permitidas`) foi enviado e aguarda resposta. Ver proposal.md - Why e "Dependências do back-end".

## Goals / Non-Goals

- **Goal**: reaproveitar integralmente o mecanismo de ações da lista, sem uma segunda fonte de verdade sobre quando verificar.
- **Non-Goal**: alterar a home (ela continua filtrando `verificado=true`), critérios automáticos de verificação, histórico de quem verificou.

## Decisions

### Ações novas entram no mesmo caminho das existentes
`verificar` e `desverificar` viram dois valores a mais em `ACAO_LABELS`/`ACOES_ORDEM` e dois casos em `use-moderar-imovel` (`POST /imoveis/{id}/verificar|desverificar`, devolvendo `ImovelDetail`, com as mesmas invalidações `["imovel", id]`, `["imoveis"]`, `["admin-imoveis"]` e a recarga em caso de erro). Valores desconhecidos de `acoes_permitidas` já são ignorados pelo front, então a lista não quebra se a API mandar uma ação nova antes do deploy do front.

### Sem confirmação
Verificar e remover a verificação são reversíveis e não afetam a publicação nem visitas; vão direto, como aprovar e republicar. Só pausar e rejeitar mantêm o diálogo.

### Ordem e aparência
Os botões de verificação ficam depois dos de publicação (`ACOES_ORDEM`: aprovar, republicar, pausar, rejeitar, verificar, desverificar), em estilo secundário (`outline`) para não competir com a ação principal. O selo "Verificado" fica ao lado do selo de status.

### Filtro de verificação depende do back-end
Um `Select` "Verificação" (Todos / Verificados / Não verificados) manda `verificado=true|false` a `GET /admin/imoveis`, voltando à página 1 como os demais filtros. Sem esse parâmetro na API, a tarefa do filtro é descartada e o requisito correspondente sai do spec **antes** da implementação (filtrar no cliente só a página carregada mostraria contagens falsas).

### Erros
Mesmo helper `describeImovelAcaoError`: `transicao_invalida` ("este imóvel mudou de status/situação, atualizando a lista") recarrega a lista; os demais usam as mensagens genéricas em português. A mensagem em inglês da API nunca é exibida.

## Risks / Trade-offs

- [Implementar antes das rotas existirem] → a change está marcada como bloqueada; o `apply` deve começar conferindo o `openapi.json` de produção (`/imoveis/{imovel_id}/verificar`, `ListingAction` com os dois valores, parâmetro `verificado` no admin).
- [O back-end pode decidir que verificar só vale para `publicado`] → irrelevante para o front, que segue `acoes_permitidas`; o texto do spec fala em "a API informa como verificável".
- [A semântica de pausar/rejeitar quanto ao `verificado` (manter ou limpar) ainda é decisão deles] → o front só reflete o que a API devolver na próxima carga da lista.

## Migration Plan

Nenhuma migração. Quando o back-end publicar: `npm run api:types`, implementar, verificar com a API real (conta staff) e só então liberar o uso do botão para a equipe.
