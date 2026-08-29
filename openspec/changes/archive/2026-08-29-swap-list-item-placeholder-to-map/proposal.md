## Why

O card de lista horizontal (`PropertyListItem`, usado pelos resultados de `/busca`) ainda mostra o ícone genérico de casa em vez de qualquer informação visual sobre o imóvel — a mesma limitação que o card em grade (`PropertyCard`) tinha antes do change `swap-card-placeholder-to-map`: o endpoint de busca (`GET /imoveis`) não retorna fotos reais, só a página de detalhe do imóvel tem isso. `PropertyListItem` já recebe `latitude`/`longitude` (via spread de `toPropertyDisplayData`), só não os usa — dá pra fechar esse mesmo gap reaproveitando a solução já pronta e testada (preview de mapa não-interativo via `MapView`), sem nenhuma decisão técnica nova.

## What Changes

- `PropertyListItem` passa a exibir uma pré-visualização de mapa (mesmo padrão do `PropertyCard`: `MapView` com `interactive={false}`, zoom 15, marcador sem label) na área do thumbnail, quando o imóvel tiver latitude/longitude válidos.
- O placeholder atual (`/property-placeholder.svg`) continua existindo como fallback só para o caso de borda em que não há coordenadas.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `property-listing`: o requisito "Card de imóvel em formato de lista horizontal" ganha um cenário explícito sobre o comportamento do thumbnail (foto real > mapa > placeholder), referenciando a mesma regra já definida no requisito "Card de imóvel exibe dados essenciais" (modificado no change anterior) em vez de deixar implícito.

## Impact

- `src/components/property/PropertyListItem.tsx`: área do thumbnail (`h-24 w-24`).
- Sem mudança em `MapView.tsx`, `globals.css` ou `mapImovel.ts` — tudo que esse change precisa (`interactive`, override de `pointer-events` do controle de atribuição, `latitude`/`longitude` em `PropertyDisplayData`) já foi implementado e testado no change `swap-card-placeholder-to-map`.
- Página afetada: `/busca` (via `SearchResultsList.tsx`, que já passa `latitude`/`longitude` por spread, sem mudança necessária ali).
- Sem mudança de API/backend.
