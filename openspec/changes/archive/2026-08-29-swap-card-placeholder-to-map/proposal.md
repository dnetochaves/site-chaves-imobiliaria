## Why

Hoje todo card de imóvel (`PropertyCard`, usado na Home, `/alugar` e `/comprar`) sempre exibe o mesmo ícone genérico de casa como placeholder de imagem. Isso acontece porque `ImovelSummary` — o formato retornado pelo endpoint de busca (`GET /imoveis`) que alimenta essas listagens — não inclui fotos do imóvel (só `ImovelDetail`, a página de um imóvel específico, tem `fotos`). Ou seja, o placeholder não é uma exceção rara: é o que aparece em 100% dos cards hoje, sem nenhuma informação visual útil sobre o imóvel. Como o sistema já tem latitude/longitude de cada imóvel e já tem um componente de mapa (MapLibre + CARTO) funcionando na página de detalhe, dá pra usar essa localização pra tornar o card mais informativo, no lugar do ícone genérico.

## What Changes

- `PropertyCard` passa a exibir uma pré-visualização de mapa (não-interativa, com um marcador na localização do imóvel) na área da imagem, quando o imóvel tiver latitude/longitude válidos.
- O placeholder atual (`/property-placeholder.svg`) deixa de ser o caminho principal e passa a ser usado só no caso de borda em que o imóvel não tem coordenadas válidas.
- Foto real continua sendo prioridade sobre o mapa, para o dia em que a API de busca passar a retornar fotos (não é o caso hoje — ver Impact).

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `property-listing`: o requisito "Card de imóvel exibe dados essenciais" muda o que é exibido na ausência de foto real — de "imagem de placeholder" para "pré-visualização de mapa com a localização do imóvel", com o placeholder virando fallback de segundo nível (só quando não há coordenadas).

## Impact

- `src/components/property/PropertyCard.tsx`: área de imagem do card.
- `src/components/property/mapImovel.ts`: `latitude`/`longitude` já existem em `PropertyDisplayData`, sem mudança de shape necessária.
- `src/components/map/MapView.tsx`: reaproveitado como preview de mapa não-interativo (novo modo de uso, sem mudança na API pública do componente sendo garantida ainda — decidir em design.md).
- Páginas afetadas indiretamente (usam `PropertyCard` sem mudança própria): Home (`SelecionadosParaHoje.tsx`), `/alugar`, `/comprar`, e `PropertyListing.tsx` (componente já sinalizado como código morto na issue #1 — não é reativado por este change, só deixa de estar desatualizado caso alguém o reative).
- Sem mudança de API/backend — usa dados já retornados por `GET /imoveis` (`unidade.latitude`/`unidade.longitude`).
