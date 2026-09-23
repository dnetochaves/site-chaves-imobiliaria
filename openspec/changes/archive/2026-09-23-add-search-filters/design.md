## Context

`filters.ts` centraliza estado (`SearchFiltersState`), parsing da URL (`parseFilters`), serialização de volta pra URL (`filtersToSearchParams`), conversão pra parâmetros da API (`filtersToApiParams`) e chips removíveis (`getActiveFilterChips`). `SearchFilters.tsx` é o único componente que lê/escreve esse estado. Ver proposal.md para a motivação e as decisões já tomadas com o usuário (campo principal vira `q`, filtros novos dentro de "Mais filtros").

## Goals / Non-Goals

**Goals:**
- Os 6 filtros novos (`q`, `tipo`, `cidade`, `quartos_min`, `vagas_min`, `area_min`) e a ordenação `recentes` ficam disponíveis na tela, com URL e chips consistentes com o padrão já existente.
- Links de fora (`?bairro=`, `?local=`) continuam funcionando sem mudança nos arquivos que os geram.

**Non-Goals:**
- Tipo do imóvel em qualquer lugar fora da busca (cards, detalhe, `/anunciar`) — `add-property-type`.
- Mudar a UI/lógica de `quartos` exato — só coexiste com `quartos_min`, sem consolidação.

## Decisions

### 1. Campo principal: `bairro` vira `q` no estado interno, com `bairro`/`local` como sinônimos só de entrada
`SearchFiltersState.bairro: string` → renomeado pra `q: string`. `parseFilters` passa a ler `searchParams.get("q") ?? searchParams.get("bairro") ?? searchParams.get("local") ?? ""` — preserva os links existentes como valor inicial. `filtersToSearchParams` e `filtersToApiParams` escrevem só `q` daqui pra frente (a URL da própria tela de Busca, depois de qualquer interação, passa a usar `?q=`, não mais `?bairro=`). O placeholder do input muda de "Bairro, cidade" pra algo que reflita a busca mais ampla (ex.: "Bairro, rua, condomínio...").

### 2. Cinco filtros novos, mesmo padrão dos existentes
`SearchFiltersState` ganha `tipo: string` (vazio = qualquer), `cidade: string`, `quartosMin: string`, `vagasMin: string`, `areaMin: string`. Em `filtersToApiParams`: `tipo: filters.tipo || undefined`, `cidade: filters.cidade || undefined`, `quartos_min: filters.quartosMin ? Number(filters.quartosMin) : undefined`, `vagas_min` idem, `area_min: filters.areaMin || undefined` (a API aceita `number | string`, mesmo padrão já usado pra `preco_min`/`preco_max`). Cada um ganha uma entrada em `getActiveFilterChips`, mesmo padrão de `mobiliado`.

### 3. UI: select de tipo + inputs numéricos dentro do painel "Mais filtros" já existente
Reaproveita o `<Select>` do design system (já usado pro `Ordenar`). Opções do tipo, em pt-BR: Apartamento, Casa, Cobertura, Studio, Kitnet, Terreno, Comercial, Outro (valores exatos do enum `PropertyType`), mais "Qualquer tipo" (vazio). `cidade` como `<Input>` de texto. `quartosMin`/`vagasMin`/`areaMin` como `<Input>` numérico (`inputMode="numeric"`), mesmo padrão de `precoMin`/`precoMax` (estado local + `onBlur`/Enter aplicando o filtro, evitando uma requisição por tecla digitada).

### 4. Ordenação: só adicionar a opção
`SORT_OPTIONS` em `SearchResultsList.tsx` ganha `{ value: "recentes", label: "Mais recentes" }`. Sem mudança de spec (o requisito já cobre "trocar o critério de ordenação" genericamente).

## Risks / Trade-offs

- [Trocar o campo principal de `bairro` pra `q` muda o texto que aparece na URL da tela de Busca depois de qualquer interação (de `?bairro=` pra `?q=`)] → Aceitável: links pra `/busca?bairro=X`/`?local=X` de fora continuam funcionando (só passam a virar `?q=X` assim que a tela re-serializa a URL); nenhum link existente aponta pra uma URL de Busca já serializada com `bairro=`, então não há link quebrado.
