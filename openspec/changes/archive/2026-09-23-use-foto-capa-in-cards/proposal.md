## Why

`GET /imoveis` agora retorna `foto_capa` (URL da primeira foto do imóvel, ou `null`) — o gap de API que motivou o preview de mapa nos cards (`swap-card-placeholder-to-map`, `swap-list-item-placeholder-to-map`) deixou de existir. `PropertyCard` e `PropertyListItem` já implementam a prioridade certa (foto real > mapa > placeholder); só falta preencher o dado.

## What Changes

- `toPropertyDisplayData` passa a repassar `foto_capa` como `imageUrl`, ativando a foto real nos cards que já sabem priorizá-la.
- `PropertyCard`/`PropertyListItem`: `unoptimized` no `<Image>` de `imageUrl` (mesmo fix já aplicado em `PropertyGallery.tsx` pra fotos de host arbitrário).
- `FavoritoItem.tsx`: usa `imageUrl` quando disponível, no lugar do placeholder sempre fixo que tinha hoje.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `property-listing`: ajuste de texto (não de comportamento) na cena "Listagem sem foto disponível nos dados recebidos" — o parêntese que dizia que o endpoint "retorna apenas o resumo do imóvel" está desatualizado, já que o resumo agora inclui foto.

## Impact

- `src/components/property/mapImovel.ts`, `PropertyCard.tsx`, `PropertyListItem.tsx`, `src/app/favoritos/_components/FavoritoItem.tsx`.
- Sem mudança de API/schema (já regenerado) nem de rota.
- Fora de escopo: preview de mapa em `FavoritoItem.tsx` (gap pré-existente, não introduzido aqui), `next.config.ts`, campo `tipo` e filtros novos de busca (changes futuros).
