## Context

`PropertyListItem.tsx` renderiza `<Image src={imageUrl ?? "/property-placeholder.svg"} />` num container `h-24 w-24 overflow-hidden rounded-lg`. `PropertyListItemProps` já é `PropertyDisplayData & {...}`, então `latitude`/`longitude` já chegam no componente via o spread `{...item}` feito por `SearchResultsList.tsx` — só não são desestruturados nem usados hoje.

Todas as decisões técnicas relevantes já foram tomadas e testadas no change `swap-card-placeholder-to-map` (arquivado em `openspec/changes/archive/2026-08-29-swap-card-placeholder-to-map/design.md`): `MapView` com `interactive={false}`, classe `maplibregl-noninteractive` + regra em `globals.css` com `!important` pra neutralizar o `pointer-events: auto` que o próprio CSS do MapLibre aplica no controle de atribuição (sem isso, um clique no controle intercepta a navegação do `<Link>`). Este change só reaplica esse mesmo padrão num componente diferente.

## Goals / Non-Goals

**Goals:**
- Thumbnail do card de lista (`/busca`) mostra a localização real do imóvel via mini-mapa, no lugar do ícone genérico, com o mesmo comportamento (não-interativo, clique navega pro card inteiro) já validado no card em grade.

**Non-Goals:**
- Qualquer decisão técnica nova sobre o mapa (zoom, interatividade, correção do controle de atribuição) — já resolvidas e reaproveitadas como estão.
- Foto real (mesma limitação de API do change anterior).

## Decisions

### 1. Reaplicar o mesmo padrão do `PropertyCard`
`PropertyListItem` passa a desestruturar `latitude`/`longitude` de `PropertyDisplayData` e, quando ambos são números válidos, renderiza `<MapView center={[longitude, latitude]} zoom={15} markers={[{ id, center: [longitude, latitude] }]} interactive={false} className="absolute inset-0 h-full w-full" />` dentro do container `h-24 w-24` já existente (que já tem `relative overflow-hidden rounded-lg`, então não precisa de ajuste de clipping ou posicionamento no container pai). Sem coordenadas, mantém o `<Image>` de placeholder.

### 2. Ajuste em `MapView`: forçar atribuição compacta quando `interactive={false}`
Descoberto ao verificar visualmente: no thumbnail de 96×96px, o controle de atribuição do MapLibre renderizava expandido (texto completo "MapLibre | © CARTO, © OpenStreetMap contributors"), cobrindo o mapa inteiro — o comportamento responsivo padrão do MapLibre (colapsar abaixo de certa largura) não se aplicou de forma confiável nesse container tão pequeno. Corrigido em `MapView.tsx`, passando `attributionControl: { compact: true }` ao construtor do `maplibregl.Map` sempre que `interactive={false}` (mantendo o padrão `true`/expandido para os mapas grandes e interativos existentes — detalhe do imóvel, `/busca`, `/anunciar` — que não mudam). Como isso é uma mudança em `MapView`, compartilhada, o card em grade (`PropertyCard`, do change anterior) também passa a usar atribuição compacta — mudança positiva e consistente, não uma regressão (o ícone colapsado ali já era o comportamento observado, só ficou garantido em vez de dependido do breakpoint automático).

## Risks / Trade-offs

- [Mapa num thumbnail pequeno (96×96px) pode ficar pouco legível] → Aceitável: a intenção é dar uma noção visual de localização, não um mapa navegável — mesmo racional do card em grade, só numa área menor. Sem mitigação adicional neste change.
