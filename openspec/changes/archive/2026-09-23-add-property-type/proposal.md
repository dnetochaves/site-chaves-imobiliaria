## Why

A API já retorna `unidade.tipo` (apartamento, casa, cobertura, studio, kitnet, terreno, comercial ou outro) em toda listagem e no detalhe de imóvel, e o filtro de busca por tipo já foi implementado (`add-search-filters`). Mas o campo em si nunca é exibido pro usuário — cards, lista e página de detalhe não mostram o tipo do imóvel, e o formulário de `/anunciar` não permite informá-lo ao cadastrar.

## What Changes

- Cards de imóvel (grade e lista) passam a exibir o tipo do imóvel, no mesmo padrão visual já usado pros outros indicadores (badge/chip).
- Página de detalhe passa a exibir o tipo do imóvel.
- Formulário de `/anunciar` ganha um campo de seleção de tipo (as 8 opções da API, mais uma opção vazia já que o campo é opcional), e passa a enviá-lo ao cadastrar.
- Quando o imóvel não tem tipo definido (`tipo: null`), nenhum badge/chip de tipo é exibido — mesmo padrão já usado pros indicadores booleanos (mobiliado/aceita pets) quando não aplicáveis.
- `TIPO_OPTIONS`/`PropertyType`, hoje definidos dentro de `src/app/busca/filters.ts` (só pro filtro de busca), são movidos pra um módulo compartilhado — mudança interna, sem alterar o comportamento já existente da tela de Busca.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `property-listing`: cards de imóvel (grade e lista) passam a exibir o tipo do imóvel como um dos dados exibidos.
- `property-detail`: página de detalhe passa a exibir o tipo do imóvel.
- `list-property`: formulário de cadastro passa a coletar o tipo do imóvel (opcional).

## Impact

- `src/components/property/mapImovel.ts`, `PropertyCard.tsx`, `PropertyListItem.tsx`.
- `src/app/imoveis/[imovelId]/page.tsx`.
- `src/app/anunciar/_components/ListPropertyForm.tsx`, `src/lib/api/hooks/use-create-imovel.ts` (payload já aceita `tipo`, sem mudança no hook em si).
- Novo módulo compartilhado (ex.: `src/lib/property-types.ts`) e `src/app/busca/filters.ts` (só o import, sem mudança de comportamento).
- Fora de escopo: filtro de busca por tipo (já implementado); edição de imóvel já cadastrado (não existe tela de edição hoje).
