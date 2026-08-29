## Context

`PropertyCard` (`src/components/property/PropertyCard.tsx`) hoje renderiza `<Image src={imageUrl ?? "/property-placeholder.svg"} />` na área de imagem. Nenhum caller passa `imageUrl`, então esse placeholder é sempre o que aparece. `PropertyDisplayData` (`mapImovel.ts`) já expõe `latitude`/`longitude: number | null`, derivados de `imovel.unidade.latitude/longitude`.

`MapView` (`src/components/map/MapView.tsx`) já existe e é usado, hoje, sempre como mapa interativo em tela cheia/grande (detalhe do imóvel, resultados de busca, confirmação de endereço em `/anunciar`), com zoom 15 para foco em um único imóvel. Ver proposal.md para a motivação da troca.

## Goals / Non-Goals

**Goals:**
- Card de imóvel mostra a localização real do imóvel via mini-mapa, no lugar do ícone genérico, sem exigir foto real (que a API de busca não fornece).
- O mini-mapa não deve competir com a navegação da página (é decorativo, dentro de um `<Link>` que ocupa o card inteiro) nem com o scroll da página em listas com muitos cards.

**Non-Goals:**
- Foto real do imóvel no card de lista (API não suporta — ver proposal.md, Impact).
- Qualquer mudança na página de detalhe do imóvel ou no mapa de resultados de busca (`SearchResultsMap.tsx`) — ambos continuam interativos como já são.
- `PropertyListItem.tsx` (thumbnail 24×24 em outro contexto) — pequeno demais pra um mapa ser legível; fora de escopo deste change.

## Decisions

### 1. Reaproveitar `MapView`, adicionando um modo não-interativo
Adicionar uma prop `interactive?: boolean` (default `true`, preservando o comportamento atual em todo lugar que já usa `MapView`) que repassa `interactive: false` pro construtor do `maplibregl.Map`. Essa opção nativa do MapLibre desliga de uma vez todos os handlers embutidos (scroll zoom, drag pan, double-click zoom, keyboard, touch zoom/rotate).

`interactive: false` sozinho não é suficiente: o controle de atribuição do MapLibre (`© CARTO`/`OpenStreetMap contributors`) continua sendo um elemento real, clicável, sobreposto ao canvas — testado ao vivo no navegador e confirmado que um clique nele intercepta o evento antes de chegar no `<Link>` do card (fica na mesma página, sem navegar). A causa raiz: o próprio CSS do MapLibre define `.maplibregl-ctrl { pointer-events: auto }` (pra controles funcionarem mesmo com o mapa em geral não-interativo), então um simples `pointer-events: none` no container do `MapView` não basta — essa regra do MapLibre, com a mesma especificidade, reabilita eventos de ponteiro nos controles.

Corrigido em duas partes: (1) `MapView` aplica uma classe `maplibregl-noninteractive` no seu container sempre que `interactive={false}`; (2) uma regra global em `globals.css` (`.maplibregl-noninteractive, .maplibregl-noninteractive .maplibregl-ctrl { pointer-events: none !important }`) vence a regra do MapLibre com `!important`, desligando também os controles. Como o mapa é descendente do `<Link>` do card (não um irmão sobreposto), tornar todo o subtree transparente a eventos de ponteiro faz qualquer clique "atravessar" e ser capturado pelo `<Link>` ancestral normalmente — verificado clicando deliberadamente em cima da área do mapa (antes falhava) e confirmando a navegação para `/imoveis/{id}`.

Alternativa descartada: criar um componente de mapa novo, só para preview — rejeitada porque duplicaria a configuração de estilo/CARTO/worker já centralizada em `MapView`.

### 2. Um `MapView` por card, zoom fixo em 15
Mesmo zoom já usado nas outras telas para foco em um único imóvel (`/imoveis/[imovelId]`, `/anunciar`). Sem `fitToMarkers` (só um marcador, não faz diferença) e sem necessidade de props de tamanho novas — `MapView` já aceita `className` para controlar dimensões, então o card passa a mesma classe de aspect-ratio que a `<Image>` usava (`absolute inset-0` dentro do container `aspect-[4/3]` já existente).

Custo de performance (N mapas WebGL simultâneos numa listagem com vários cards) é aceitável pelo mesmo motivo que a busca (`/busca`) já roda um `MapView`: o volume atual de imóveis é pequeno (poucas dezenas), e cada `MapView` já limpa seu próprio mapa no unmount. Não otimizar antecipadamente (lazy-load por scroll, por ex.) neste change; revisitar se a base de imóveis crescer.

### 3. Marcador sem label
`MapMarker.label` (usado pra mostrar preço no mapa de busca) fica de fora aqui — o preço já aparece no corpo do card, duplicar no mapa poluiria um espaço pequeno. Usar o marcador padrão do MapLibre (sem `label`).

### 4. Fallback de placeholder só quando não há coordenadas
Quando `latitude`/`longitude` forem `null` (unidade sem geocodificação), manter o comportamento atual: `<Image src="/property-placeholder.svg" />`. Esse é o único caminho que ainda usa o placeholder — reflete a nova terceira cena do requisito modificado em `specs/property-listing/spec.md`.

## Risks / Trade-offs

- [Múltiplos mapas WebGL numa página com muitos cards pode pesar em dispositivos fracos] → Sem mitigação neste change (ver Decisão 2); documentado como ponto a revisitar se a listagem crescer muito ou se houver relato de lentidão.
- [`interactive: false` desliga também o cursor de "mão" e qualquer affordance visual de mapa clicável, podendo parecer só uma imagem estática] → Aceitável — a intenção é justamente parecer uma imagem ilustrativa, não um mapa navegável dentro do card; a navegação real acontece pelo card inteiro ser um link.
