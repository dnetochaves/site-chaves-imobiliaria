## Why

`GET /imoveis` passou a aceitar filtros novos (aviso do time de back-end): `q` (busca por texto amplo), `tipo`, `cidade`, `quartos_min`, `vagas_min`, `area_min`, além da ordenação `recentes`. A tela `/busca` ainda não expõe nenhum deles.

## What Changes

- O campo de busca principal (hoje "Bairro, cidade", filtrando só por bairro exato) passa a usar `q` — busca ampla em título, descrição, rua, bairro, cidade e nome do condomínio. Links existentes com `?bairro=`/`?local=` (chips e busca da Home) continuam funcionando como valor inicial desse campo.
- Painel "Mais filtros" ganha: tipo de imóvel (select com as 8 opções da API), cidade, quartos mínimo, vagas mínimo e área mínima — cada um com chip removível, mesmo padrão de mobiliado/aceita pets.
- `quartos` exato (barra principal) continua existindo sem mudança, coexistindo com `quartos_min` (novo).
- Ordenação ganha a opção "Mais recentes".

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `search-page`: o requisito "Filtros de busca refinam os resultados" passa a cobrir busca por texto amplo e os 5 filtros adicionais novos, além dos já existentes.

## Impact

- `src/app/busca/filters.ts`, `SearchFilters.tsx`, `SearchResultsList.tsx` (opção de ordenação).
- Sem mudança em `Hero.tsx`, `CategoryShortcuts.tsx`, `alugar/page.tsx`, `comprar/page.tsx` — continuam linkando pra `/busca` como já fazem, compatibilidade garantida pelo parsing de sinônimos já existente.
- Fora de escopo: tipo do imóvel exibido em cards/detalhe/formulário de anúncio (`add-property-type`, change futuro).
