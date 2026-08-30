## Why

Depois de ver o Hero com a foto real (change `update-home-hero-salvador-photo`), o usuário achou os dois cards do canto inferior (imóvel de exemplo + credibilidade) visualmente apertados. A correção é simplificar: remover o card de imóvel de exemplo (nunca teve requisito formal, é conteúdo puramente ilustrativo) e manter só o card de credibilidade, que sobra sozinho com espaço de sobra. Também ajustar o texto do selo de estatística pra não depender de atualização mensal.

## What Changes

- Remover `HeroFeaturedCard` do Hero da Home.
- Selo de estatística: "84 chaves entregues em agosto" → "84 chaves entregues" (mesmo número real, sem referência a mês específico — evita a necessidade de atualização manual todo mês).
- Remover a borda do bloco "Tem um imóvel para alugar?" (`ListPropertyCta`), deixando-o mais fluido na página (sem a caixa delimitada).

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `home-page`: o cenário "Selo de estatística visível" do requisito "Hero da Home exibe elementos de credibilidade" deixa de implicar um rótulo de período/mês.

## Impact

- `src/app/_home/Hero.tsx`: remove a renderização de `HeroFeaturedCard`.
- `src/app/_home/HeroDeliveriesBadge.tsx`: texto do selo.
- `src/app/_home/HeroFeaturedCard.tsx`: fica sem uso — decisão em design.md.
- `HeroTrustCard.tsx`: sem mudança de código.
- `src/app/_home/ListPropertyCta.tsx`: remove as classes de borda (`border-border-default`, `border`).
