## Context

A página inicial do painel usa `useImoveis` (a busca pública), que por contrato só devolve `publicado`. O back-end entregou `GET /admin/imoveis` (staff-only) com `status` repetível, `corretor_id`, `sem_corretor`, `q`, `ordenar` (`criacao_desc` padrão, `criacao_asc`, `preco_*`), `limit`/`offset`, e cada item traz `acoes_permitidas`, `visitas_agendadas_futuras_na_unidade`, `corretor`, `criado_em`, `foto_capa`. Também entregou `POST /imoveis/{id}/republicar`. Ver proposal.md - Why. O padrão de lista com filtros já existe em leads e visitas (`VisitasLista`, `LeadRow`), e o seletor de corretor em `CorretorSeletor`.

## Goals / Non-Goals

- **Goal**: o front nunca decide sozinho quais ações valem para um status — só exibe o que `acoes_permitidas` informa (pedido explícito do back-end: quando surgirem ações novas, elas aparecem sozinhas).
- **Non-Goal**: marcar como alugado/vendido, edição dos dados do imóvel, histórico/motivo de rejeição, nome/e-mail de quem cadastrou (o back-end perguntou se queremos; fica para uma etapa futura).
- **Non-Goal**: ordenar por preço na lista — a API aceita, mas o painel só precisa de "mais novos / mais antigos" (a fila de revisão).

## Decisions

### Ações de publicação na lista; o detalhe perde os botões
`acoes_permitidas` só existe nos itens da listagem (o `ImovelDetail` não tem), e a API não tem filtro por id. Em vez de o detalhe reimplementar a regra de transição (o back-end pediu explicitamente para não fazer isso) ou depender de um campo que não existe, as ações ficam só na lista; o detalhe exibe dados, status, seletor de corretor e um link "← Voltar à lista". Alternativa descartada: manter os três botões no detalhe, que oferecem ações que a API recusa com 400 — exatamente o problema atual.

### Lista paginada com os filtros na própria tela (sem URL)
Mesmo padrão de `VisitasLista`: estado local (`status`, `corretor`, `q`, `ordenar`, `page`), `LIMITE = 20`. Filtro de status é um único select ("Todos" + os 7 status em português); a API aceita vários, mas a UI não precisa. Filtro de corretor: select com "Todos", "Sem corretor" (`sem_corretor=true`) e os corretores de `useCorretores()` sem filtro de ativo (um imóvel pode estar atribuído a um corretor já desativado). `corretor_id` e `sem_corretor` nunca são enviados juntos (a API dá 422). A busca por texto só dispara no envio do formulário/blur, como o filtro de imóvel das visitas. A ordenação usa só `criacao_desc` e `criacao_asc` — nunca `recentes`, que a API rejeita neste endpoint.

### Cache: chave própria e invalidação ampla
`useAdminImoveis(params)` usa `["admin-imoveis", params]`. As mutações de publicação e de atribuição de corretor invalidam `["admin-imoveis"]` (além do que já invalidavam: `["imovel", id]`, `["imoveis"]`), para lista e detalhe nunca divergirem. `use-moderar-imovel` ganha a ação `republicar` e, na lista, não faz `setQueryData` no detalhe (ele já atualiza `["imovel", id]` com o retorno).

### Tratamento de erro por `error.code`
Um helper em `src/lib/imovel-errors.ts` mapeia: `transicao_invalida` → "Este imóvel mudou de status. Atualizando a lista." (e a lista é recarregada); `unidade_ja_tem_anuncio_ativo` → "Esta unidade já tem outro anúncio ativo (em análise ou publicado)." (o id citado na mensagem em inglês não é lido — texto da API nunca é repassado); demais casos usam `describeApiError`. Imóvel `pausado` com `acoes_permitidas` vazia mostra essa mesma explicação como nota fixa na linha (o back-end garante que esse é o único caso em que isso acontece com pausado).

### Confirmação: só pausar e rejeitar
`pausar` e `rejeitar` abrem um `Dialog` de confirmação (padrão de `VisitaLinha`); `aprovar` e `republicar` são reversíveis ou sem perda e vão direto. O aviso de visitas usa `visitas_agendadas_futuras_na_unidade` apenas na confirmação de pausar (o back-end avisou que o número só é exato para esse caso).

### Componentes
`ImovelAdminLinha` (linha: capa, título, endereço, badge de status, data, ações, `CorretorSeletor` com `useAtribuirCorretorImovel(imovel.id)` e `useRemoverCorretorImovel`) e `ImoveisAdminLista` (filtros + paginação + estados), em `src/app/admin/_components/`. Labels de status em `src/lib/imovel-labels.ts`. A seção "Abrir imóvel por ID" continua na página, abaixo da lista.

## Risks / Trade-offs

- [Quem usava o detalhe por ID para moderar perde os botões] → a lista com filtro de status e busca cobre o mesmo caso; o detalhe linka de volta para ela.
- [Se o back-end acrescentar uma ação nova em `acoes_permitidas` que o front não conhece, o botão não teria rótulo] → o mapa de rótulos cai para o próprio valor da ação e o clique chama a rota por convenção só para as quatro ações conhecidas; valor desconhecido é ignorado (não renderiza botão) e registrado como pendência para o time.
- [Imagem de capa vem de qualquer host] → `Image unoptimized`, como na galeria da página de imóvel.

## Migration Plan

Nenhuma migração de dados; o endpoint e a ação já estão em produção. Deploy direto.
