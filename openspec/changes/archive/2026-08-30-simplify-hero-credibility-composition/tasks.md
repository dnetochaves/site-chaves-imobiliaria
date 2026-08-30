## 1. Remover o card de imóvel de exemplo do Hero

- [x] 1.1 Remover o import e o uso de `<HeroFeaturedCard />` em `Hero.tsx`
- [x] 1.2 Deletar `src/app/_home/HeroFeaturedCard.tsx` e verificar que não há mais nenhuma referência a ele no projeto (`grep -r HeroFeaturedCard src`)

## 2. Ajustar o texto do selo de estatística

- [x] 2.1 Atualizar `DELIVERIES_LABEL` em `HeroDeliveriesBadge.tsx` de "84 chaves entregues em agosto" para "84 chaves entregues"

## 3. Remover a borda do bloco "Tem um imóvel para alugar?"

- [x] 3.1 Em `ListPropertyCta.tsx`, remover as classes `border-border-default` e `border` do `<section>`, mantendo `rounded-xl p-8` e o restante do layout

## 4. Verificação visual

- [x] 4.1 Rodar o app localmente, abrir a Home e conferir: só `HeroTrustCard` no canto inferior direito da foto, sem aperto visual; selo mostrando "84 chaves entregues" sem referência a mês; bloco "Tem um imóvel para alugar?" sem borda visível; `tsc`/`eslint` limpos sem referências ao componente removido
