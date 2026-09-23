## 1. Estado e serialização (filters.ts)

- [x] 1.1 Renomear `bairro` para `q` em `SearchFiltersState`, `DEFAULT_FILTERS`, `parseFilters` (lendo `q`/`bairro`/`local` como sinônimos), `filtersToSearchParams` e `filtersToApiParams` (escrevendo só `q`)
- [x] 1.2 Adicionar `tipo`, `cidade`, `quartosMin`, `vagasMin`, `areaMin` a `SearchFiltersState`, `DEFAULT_FILTERS`, `parseFilters`, `filtersToSearchParams` e `filtersToApiParams`
- [x] 1.3 Adicionar chips removíveis pros 5 filtros novos em `getActiveFilterChips`, mesmo padrão de `mobiliado`/`aceitaPets`

## 2. Interface (SearchFilters.tsx)

- [x] 2.1 Trocar o campo principal pra usar `q` (estado local + placeholder atualizado)
- [x] 2.2 Adicionar o select de tipo de imóvel (8 opções + "Qualquer tipo") dentro do painel "Mais filtros"
- [x] 2.3 Adicionar os inputs de cidade, quartos mínimo, vagas mínimo e área mínima dentro do painel "Mais filtros"

## 3. Ordenação

- [x] 3.1 Adicionar `{ value: "recentes", label: "Mais recentes" }` a `SORT_OPTIONS` em `SearchResultsList.tsx`

## 4. Verificação

- [x] 4.1 No browser, testar cada filtro novo isoladamente (tipo, cidade, quartos mínimo, vagas mínimo, área mínima, busca por texto) e conferir que a URL e a lista de resultados refletem o filtro; remover cada um pelo chip e conferir que volta ao estado anterior
- [x] 4.2 Conferir que `/busca?bairro=X` e `/busca?local=X` (simulando os links da Home) continuam carregando com o campo de busca principal preenchido e a busca funcionando
- [x] 4.3 Testar a busca por um termo que só aparece na descrição/rua de um imóvel (não no bairro) e confirmar que ele aparece nos resultados; trocar a ordenação pra "Mais recentes" e conferir a mudança na lista; `tsc`/`eslint` limpos
