## Why

A Home (changes `add-home-page` e `revise-home-content`) já direciona todo formulário de busca, chip de bairro e atalho de perfil para `/busca` — hoje essa rota simplesmente não existe (404). Sem a tela de Busca, a Home é um beco sem saída: o usuário nunca consegue de fato buscar um imóvel.

## What Changes

- Criar a rota `/busca` com: barra de filtros (local, operação, faixa de preço, quartos, "mais filtros" com mobiliado/aceita pets), lista paginada de resultados, e um painel de mapa com pins de preço — seguindo o layout "lista e mapa lado a lado" do Ciclo 03 (`design_system/sistema-montado.pdf`).
- A Busca lê os query params já enviados pela Home (`local`, `operacao`, `bairro`, `quartos`, `aceita_pets`) e usa como filtros iniciais.
- Resultados usam um novo card horizontal compacto (diferente do card em grade da Home), com specs em pills e o mesmo ícone de coração decorativo (sem toggle funcional) já usado na Home.
- Mapa usa `MapView` (já existente) com OpenFreeMap como provedor de tiles (decisão tomada com o usuário — gratuito, sem chave de API) e pins mostrando o preço de cada imóvel a partir de `unidade.latitude`/`unidade.longitude`.
- Hover em um card da lista destaca o pin correspondente no mapa.
- Toggle "Atualizar ao mover" aparece na UI mas **não** dispara nova busca ao mover o mapa nesta fase — é puramente visual, documentado como decisão.

**Fora de escopo**: página de detalhe do imóvel (cards linkam para `/imoveis/{id}`, rota ainda não implementada — 404 esperado, mesmo padrão já usado no projeto); favoritos funcionais; busca automática ao mover/arrastar o mapa; autenticação.

## Capabilities

### New Capabilities
- `search-page`: comportamento da tela de Busca — filtros (incluindo os vindos por query param), paginação, ordenação, e a sincronização entre lista e mapa.

### Modified Capabilities
- `property-listing`: adiciona um card de imóvel em formato de lista horizontal (além do card em grade já existente), reutilizável por qualquer página que precise desse formato — a busca usa esse formato, a listagem em grade da Home continua como está.

## Impact

- **Código**: nova rota `src/app/busca/page.tsx`; novos `src/components/property/PropertyListItem.tsx` (card horizontal), `src/app/busca/_components/SearchFilters.tsx`, `SearchResultsMap.tsx` (ou nomes equivalentes, detalhado em design.md); hook `useImoveis` já existente é reutilizado (talvez estendido para os parâmetros de filtro adicionais).
- **API consumida**: `GET /imoveis` com os parâmetros já existentes (`bairro`, `preco_min`, `preco_max`, `quartos`, `mobiliado`, `aceita_pets`, `disponivel_aluguel`, `disponivel_venda`, `ordenar`, `limit`, `offset`) — nenhum endpoint novo.
- **Dependências**: nenhuma nova (MapLibre GL já é dependência do projeto desde `init-frontend-project`); OpenFreeMap é consumido via URL de estilo pública, sem SDK adicional.
