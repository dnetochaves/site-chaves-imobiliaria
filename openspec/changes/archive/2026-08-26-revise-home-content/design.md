## Context

Ver [proposal.md](proposal.md) para o porquê. A Home hoje (pós `add-home-page` + `add-site-shell`) tem: Hero simples (headline + form), `PropertyListing` real via API, atalhos por bairro, dois banners de CTA com um botão cada. O gap com o mockup real foi levantado por análise visual em alta resolução do PDF (ver histórico da conversa) e está detalhado no proposal.

## Goals / Non-Goals

**Goals:**
- Fechar o gap visual/estrutural da Home identificado no PDF, sem inventar dados que a API não tem.
- Deixar claro, no código, o que é dado real (imóveis da API) vs. conteúdo ilustrativo (card de destaque do hero, estatísticas de condomínio).

**Non-Goals:**
- Sistema de favoritos funcional.
- Integração real com dados de condomínio.
- Simulação de financiamento real (o atalho "Primeiro imóvel" só abre WhatsApp).
- Obter o número real de WhatsApp da Chaves (fica como placeholder documentado).

## Decisions

**1. Badge "Visita hoje" nos cards de imóvel: OMITIR.**
`ImovelSummary` não tem nenhum campo indicando disponibilidade de visita — exibir esse badge em imóveis reais da API seria apresentar uma informação falsa (o usuário entenderia como "esse imóvel específico tem visita disponível hoje", o que não é verdade). Diferente do ícone de favorito (que não afirma nenhum fato, é só uma affordance de UI padrão), esse badge faz uma alegação factual não sustentada pelos dados. Alternativa considerada: exibir o badge aleatoriamente em alguns cards como "decoração" — descartada por ser enganosa para o usuário final, mesmo em uma fase de desenvolvimento.

**2. Ícone de favorito: mantido, puramente decorativo, sem estado.**
Renderizado em todo card, sempre no estado "não favoritado" (contorno, não preenchido), sem `onClick` funcional. Não persiste nada, não chama API. Fica pronto visualmente para quando a capability de favoritos existir.

**3. Card de imóvel em destaque no hero (`HeroFeaturedCard`) e card de estatísticas do condomínio (`CondoStatsCard`): dados estáticos/ilustrativos, isolados em constantes no topo de cada arquivo, com comentário explícito "dado de exemplo, não vem da API".**
Evita qualquer ambiguidade futura sobre se esses números deveriam ser dinâmicos. Não são novos componentes reutilizáveis fora da Home — ficam em `src/app/_home/` junto dos outros componentes da Home.

**4. Atalhos por perfil ("Comece por onde faz sentido") mapeiam para filtros de `/busca` assim:**
- "Morar sozinho" → `/busca?quartos=1`
- "Com a família" → `/busca?quartos=3`
- "Com pets" → `/busca?aceita_pets=true` (`aceita_pets` já existe em `GET /imoveis`, confirmado no schema gerado)
- "Primeiro imóvel" → link externo `https://wa.me/<placeholder>?text=...` (número placeholder, comentário `// TODO: substituir pelo número real da Chaves` no código)

**5. Ícones dos atalhos: usar `lucide-react`** (já é dependência do projeto via shadcn/ui) — `Home` (morar sozinho), `Users` (família), `PawPrint` (pets), `Building2` (primeiro imóvel) — escolhas semanticamente equivalentes às do mockup, não uma extração pixel-a-pixel dos ícones originais (o PDF não expõe os ícones como texto/vetor extraível de forma confiável).

**6. Reutilização de `Button` variantes já existentes** (`default` para ação primária, `outline` para secundária) em todos os pares de CTA — nenhum componente de botão novo.

## Risks / Trade-offs

- **[Risco] Ícones escolhidos (lucide-react) podem não bater 100% com os do mockup original** → Mitigação: são semanticamente equivalentes e usam a mesma biblioteca já padronizada no projeto; ajuste fino de ícone é um detalhe de polimento, não uma mudança de comportamento.
- **[Trade-off] Card de estatísticas do condomínio e card de destaque do hero usam dados fixos, não configuráveis** → Aceito: são ilustrativos por natureza (não há fonte de dados real para eles neste projeto); se isso mudar, é um change futuro.

## Open Questions

Nenhuma pendente que afete specs, abordagem ou tasks deste change.
