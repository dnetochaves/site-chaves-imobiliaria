## Why

A Home implementada no change `add-home-page` divergiu bastante do mockup real (`design_system/sistema-montado.pdf`, Ciclo 03) — uma análise em alta resolução do PDF (zoom seção por seção) mostrou hero simplificado demais, atalhos de categoria com título e conteúdo errados, e banners de CTA com só um botão em vez de dois, entre outras faltas. O header/footer já foram resolvidos separadamente (`add-site-shell`). Este change fecha o gap restante, aproximando a Home do design real.

## What Changes

- **Hero**: adicionar eyebrow "ALUGUEL E COMPRA · SÃO PAULO", parágrafo de apoio, chips de bairro rápido (Pinheiros/Vila Madalena/Santa Cecília navegando para `/busca?bairro=...`), e uma coluna de imagem com um card de imóvel em destaque flutuante sobreposto (dados estáticos/ilustrativos).
- **Selecionados para hoje**: adicionar subtexto, link "Ver todos →" (navega para `/busca`), ícone de favorito decorativo (sem toggle funcional — API não suporta) nos cards.
- **Atalhos** (**BREAKING** em relação ao conteúdo atual): trocar completamente de atalhos por bairro para atalhos por perfil — título muda de "Comece por onde tudo começa" para "Comece por onde faz sentido"; os 4 cards passam a ser Morar sozinho / Com a família / Com pets / Primeiro imóvel, com ícone + descrição; os três primeiros navegam para `/busca` com filtros (quartos, aceita_pets); o último ("Primeiro imóvel") é um link externo para WhatsApp, não para `/busca`.
- **Banner de condomínio**: adicionar badge "NOVO · CHAVES CONDOMÍNIOS", subtexto, segundo botão ("Como funciona", outline, ao lado de "Pedir uma proposta"), texto de diagnóstico gratuito, e um card de estatísticas ilustrativas (Ed. Aurora) ao lado.
- **CTA "Tem um imóvel para alugar?"**: adicionar segundo botão ("Falar com alguém", outline, ao lado de "Anunciar imóvel").

**Fora de escopo**: sistema de favoritos funcional, integração real com dados de condomínio (o card de estatísticas é estático/ilustrativo), simulação de financiamento real, autenticação, número real de WhatsApp da empresa (usa placeholder documentado).

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `home-page`: revisão de "Home exibe imóveis selecionados" (subtexto + "Ver todos"), substituição completa de "Atalhos de categoria navegam para a busca pré-filtrada" por atalhos por perfil (a maioria ainda navega para busca pré-filtrada, um navega para WhatsApp), e revisão de "CTAs institucionais são links visíveis" (dois botões por banner + card de estatísticas do condomínio).

## Impact

- **Código**: `src/app/_home/Hero.tsx`, `CategoryShortcuts.tsx`, `CondoBanner.tsx`, `ListPropertyCta.tsx` (revisados); `src/app/page.tsx` (subtexto/link na seção de listagem); possível novo componente para o card de imóvel em destaque do hero e para o card de estatísticas do condomínio.
- **API consumida**: nenhuma nova — os filtros dos atalhos usam parâmetros já existentes em `GET /imoveis` (`quartos`, `aceita_pets`).
- **Dependências**: nenhuma nova.
