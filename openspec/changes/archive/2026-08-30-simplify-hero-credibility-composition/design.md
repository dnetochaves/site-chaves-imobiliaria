## Context

`Hero.tsx` hoje renderiza três elementos absolutos sobre a foto: `HeroDeliveriesBadge` (topo direito), `HeroFeaturedCard` (base esquerda) e `HeroTrustCard` (base direita). Os dois últimos, lado a lado na base, ficaram visualmente apertados no feedback do usuário.

## Goals / Non-Goals

**Goals:**
- Base da foto do Hero fica só com `HeroTrustCard`, resolvendo o aperto visual.
- Selo de estatística não fica preso a um mês específico.

**Non-Goals:**
- Reposicionar ou redimensionar `HeroTrustCard` — ele já ocupa bem o espaço sozinho no canto, sem mudança de CSS necessária.
- Qualquer ajuste em `HeroDeliveriesBadge` além do texto.

## Decisions

### 1. Remover `HeroFeaturedCard.tsx` do projeto (não só do Hero)
Sem nenhuma spec formal referenciando esse componente e sem nenhum outro caller depois dessa remoção (confirmado: só era usado em `Hero.tsx`), fica código morto se só for desconectado. Segue o mesmo padrão já usado nesta sessão pra hooks/componentes que ficam genuinely sem uso (ex.: `use-visitas-disponiveis-em-breve.ts`, removido no change `swap-home-verified-source`): deletar o arquivo inteiro, não só o import.

### 2. Selo: remover a referência a mês, manter o número real
`HeroDeliveriesBadge.tsx` já documenta em comentário que "84" é uma estatística real fornecida pela administração. Só o texto muda, de "84 chaves entregues em agosto" pra "84 chaves entregues" — mesmo dado, sem o qualificador temporal que exigiria atualização manual todo mês.

### 3. Remover a borda do `ListPropertyCta`
Troca `className="border-border-default flex flex-col gap-4 rounded-xl border p-8 ..."` por `className="flex flex-col gap-4 rounded-xl p-8 ..."` — mantém padding e arredondamento, tira só a borda, deixando o bloco mais integrado ao resto da página. Puramente visual, nenhum requisito de spec descreve a borda desse bloco (o requisito "CTAs institucionais são links visíveis" só exige os elementos clicáveis visíveis).

## Risks / Trade-offs

- [Selo sem período pode parecer um total histórico acumulado, não um número recente] → Aceitável — o usuário confirmou explicitamente essa direção (opção "Só tirar 'em agosto'" via AskUserQuestion), preferindo simplicidade a precisão temporal por enquanto.
