## Why

`/ajuda` é referenciada no Header e no Footer desde o change `add-site-shell`, mas a rota nunca foi construída — hoje dá 404. Não há mockup no design pra ela; o usuário confirmou que o conteúdo deve ser uma central de dúvidas (FAQ) usando só fatos já reais do site, mais um contato direto via WhatsApp, sem inventar prazos, taxas ou horário de atendimento não confirmados.

## What Changes

- Nova rota `/ajuda`: intro curta, uma FAQ organizada por tema (buscar/visitar um imóvel, alugar com garantia, anunciar um imóvel, virar corretor parceiro), e um bloco de contato direto via WhatsApp, seguindo o padrão visual já usado em `/garantia` e `/sobre`.
- Todo o conteúdo da FAQ vem de comportamento já real e já implementado no site (visita via solicitação de contato, garantia de pagamento pro proprietário, fluxo de anúncio, parceria com corretores, busca pública sem login) — nada de política nova.

## Capabilities

### New Capabilities

- `help-page`: define o comportamento observável da página `/ajuda` — a central de dúvidas e o contato via WhatsApp.

### Modified Capabilities

(nenhuma — `site-shell` já exige o link "Ajuda" no Header; isso não muda, só passa a levar a uma página real)

## Impact

- `src/app/ajuda/page.tsx` (novo).
- Sem mudança em `Header.tsx`, `Footer.tsx` ou qualquer outra página.
- Sem link novo pra `/condominios`, `/condominios/proposta` ou `/gestao` — continuam fora de escopo (rotas quebradas pré-existentes, ou deferidas por decisão anterior do usuário).
