## Context

O painel administrativo já segue um padrão consolidado (imóveis, leads, visitas): uma seção por rota sob `src/app/admin/`, hooks TanStack Query sobre `openapi-fetch` (`apiClient`), erros convertidos com `toApiError`/exibidos com `describeApiError`, e uma nova aba em `src/app/admin/layout.tsx`. O schema gerado (`src/lib/api/generated/schema.ts`) já tem `CorretorCreate`, `CorretorUpdate`, `CorretorRead`, `CorretorRef` e as seis rotas de `/corretores`. Ver proposal.md - Why.

## Goals / Non-Goals

- **Goal**: seguir exatamente o padrão de código já usado por leads/visitas (mesma estrutura de página, hooks, labels, erros), para manter o painel consistente.
- **Goal**: um único cache de "corretores ativos" reaproveitado tanto pela página de gestão quanto pelos dois seletores (imóvel e lead), sem duplicar a chamada.
- **Non-Goal**: upload de foto (o campo é uma URL simples, um `Input` de texto).
- **Non-Goal**: busca por nome/CRECI no back-end — a busca por nome da página de gestão filtra a lista já carregada, no cliente.

## Decisions

### Um hook de leitura para "todos" e um para "ativos", ambos sobre a mesma chave raiz
`useCorretores({ ativo }: { ativo?: boolean })` com `queryKey: ["corretores", { ativo }]`. A página de gestão chama sem `ativo` quando o alternador "mostrar inativos" está ligado, e com `ativo: true` quando desligado (esse é o estado inicial); os dois seletores (imóvel e lead) sempre chamam com `ativo: true`. Uma mutação que cria, edita, desativa ou reativa invalida o prefixo `["corretores"]` inteiro, então os dois estados de filtro e os seletores se atualizam juntos — mais simples do que rastrear qual página está montada.

### Um hook de mutação por ação de cadastro, um por atribuição
Seguindo o padrão de `use-moderar-imovel`/`use-atualizar-visita`:
- `useCriarCorretor()`, `useAtualizarCorretor(id)` (PATCH parcial - só envia os campos alterados do formulário), `useDesativarCorretor()`, `useReativarCorretor()` — todas invalidam `["corretores"]`.
- `useAtribuirCorretorImovel(imovelId)` (POST/DELETE conforme o valor escolhido no seletor, ou `null` para remover) invalida `["imovel", imovelId]` (a tela de moderação já usa essa chave) e `["imoveis"]` (a lista pública/painel, que também mostra `corretor`).
- `useAtribuirCorretorLead()` (recebe `leadId` na chamada, como `useAtualizarVisita` recebe `visitaId`) invalida `["leads"]`.

### 409 de CRECI duplicado como erro de campo, não genérico
O formulário usa `describeApiError` com uma mensagem própria por status: para 409, "Já existe um corretor com este CRECI nesta UF." associada visualmente aos dois campos de CRECI (mesmo tratamento em pt-BR que `describeConcluirError`/`describeCancelarError` já dão a 400/403/404 em `visita-errors.ts` — um helper `describeCorretorError` equivalente, específico deste cadastro).

### 409 de corretor inativo no seletor de atribuição
Mesma ideia: o seletor mostra a mensagem "Este corretor está inativo; reative-o antes de atribuir." quando a API recusa com 409, revertendo a seleção visual para o corretor anterior (ou "Nenhum").

### Seletor de atribuição como um componente compartilhado
`CorretorSeletor` (em `src/components/` ou junto de `src/lib/corretor-labels.ts`, a definir na implementação) recebe `corretorAtual: CorretorRef | null` e um callback `onAtribuir(corretorId: number | null)`, e é usado tanto na tela de moderação de imóvel quanto no `LeadRow` — evita duas implementações do mesmo combobox + estado de erro + "remover atribuição".

## Risks / Trade-offs

- [Invalidar `["corretores"]` inteiro a cada mutação de cadastro re-busca a lista completa, mesmo quando só um campo mudou] → aceitável: a lista é pequena (documento do back-end confirma isso) e o padrão já usado em leads/visitas faz o mesmo.
- [O componente de seletor compartilhado precisa funcionar em dois contextos com IDs diferentes (`imovelId` vs `leadId`)] → o componente só expõe `corretorAtual`/`onAtribuir`; cada tela decide qual hook de atribuição chamar no callback, mantendo o componente sem saber se está num imóvel ou num lead.

## Migration Plan

Nenhuma migração de dados — os endpoints já estão em produção. Implementação e deploy direto, sem flag.
