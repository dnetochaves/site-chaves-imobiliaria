## Context

`toPropertyDisplayData` (`mapImovel.ts`) converte `ImovelSummary` em `PropertyDisplayData`, consumida por spread em todos os callers de `PropertyCard`/`PropertyListItem` (Home, `/alugar`, `/comprar`, `/busca`) — ver proposal.md. `PropertyCard`/`PropertyListItem` já calculam `hasCoordinates = !imageUrl && ...`, então só precisam receber `imageUrl` preenchido pra a prioridade foto > mapa > placeholder passar a funcionar de ponta a ponta.

## Goals / Non-Goals

**Goals:**
- Cards mostram a foto real do imóvel quando a API manda uma, em todas as listagens.
- Fotos de host arbitrário (imóveis cadastrados via `/anunciar`) não quebram (mesmo fix já usado em `PropertyGallery.tsx`).

**Non-Goals:**
- Preview de mapa em `FavoritoItem.tsx` — fora de escopo, gap pré-existente.
- Mudar a estrutura de `PropertyDisplayData` além de adicionar `imageUrl`.

## Decisions

### 1. `imageUrl` entra em `PropertyDisplayData`, não como prop separada
Hoje `PropertyCardProps`/`PropertyListItemProps` já declaram `imageUrl?: string` fora de `PropertyDisplayData`. Adicionar `imageUrl` dentro do próprio `PropertyDisplayData` (retornado por `toPropertyDisplayData`) faz o spread `{...toPropertyDisplayData(imovel)}`, já usado por todo caller, preencher a prop automaticamente — sem tocar em nenhuma página. `imovel.foto_capa ?? undefined` (não `null`, pra bater com o tipo `string | undefined` que os componentes já esperam).

### 2. `unoptimized` nos dois `<Image>` que renderizam `imageUrl`
Mesma razão e mesmo padrão já usado em `PropertyGallery.tsx`: `next.config.ts`'s `images.remotePatterns` só libera `picsum.photos` (dado de seed); fotos de imóveis reais (cadastrados via `/anunciar`) vêm de host arbitrário e o otimizador do Next bloqueia sem essa prop. Sem essa mudança, os cards de imóveis reais quebrariam assim que `imageUrl` deixasse de ser sempre `undefined`.

### 3. `FavoritoItem.tsx`: mesmo padrão simples, sem preview de mapa
Troca só `src="/property-placeholder.svg"` por `src={display?.imageUrl ?? "/property-placeholder.svg"}` + `unoptimized`. Não importa `MapView` nem usa coordenadas — esse componente nunca teve o preview de mapa dos outros changes (gap pré-existente, não introduzido aqui); adicionar isso é escopo maior (soma import + layout) e fica de fora.

## Risks / Trade-offs

- [`FavoritoItem.tsx` continua sem preview de mapa quando não há foto] → Aceitável nesta change (gap pré-existente); pode virar um change próprio depois, seguindo o padrão já usado nos outros dois componentes.
