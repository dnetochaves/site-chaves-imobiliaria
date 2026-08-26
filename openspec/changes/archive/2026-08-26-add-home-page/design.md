## Context

Ver [proposal.md](proposal.md) para o porquê. Contexto técnico relevante: o change `init-frontend-project` já entregou tokens/tema, shadcn/ui, o client de API tipado (`src/lib/api/client.ts`, gerado a partir de `src/lib/api/generated/schema.ts`) e o padrão de hook TanStack Query (`useHealthCheck`, em `src/lib/api/hooks/`).

Investigando o schema gerado, `GET /imoveis` (operação `search_imoveis_get`) retorna `PropertySearchResults { items: ImovelSummary[], total, limit, offset }`. `ImovelSummary` traz `titulo`, `status`, `disponivel_aluguel`, `disponivel_venda`, `mobiliado`, `aceita_pets`, `verificado`, `valor_aluguel`, `valor_venda`, `valor_total_mensal`, `valor_condominio`, `valor_iptu` e um objeto `unidade: UnidadeRead` (com `bairro`, `cidade`, `area_util_m2`, `quartos`, `banheiros`, `vagas_garagem`, `latitude`/`longitude`). **`ImovelSummary` não tem nenhum campo de foto** — fotos só existem em `ImovelDetail` (busca de um imóvel específico) e no payload de submissão. Isso significa que, com o endpoint atual, a Home (e futuramente a Busca) sempre vai exibir um placeholder de imagem nos cards — não é um caso de borda, é o comportamento normal hoje. Fica registrado como um ponto a revisitar com o backend (adicionar uma foto de capa no resumo), fora do escopo deste change.

## Goals / Non-Goals

**Goals:**
- Home navegável de verdade, consumindo dados reais de `GET /imoveis`.
- Property Card como componente reutilizável e independente da Home, pronto para a Busca reusar depois.

**Non-Goals:**
- Otimizar SEO da seção de imóveis em destaque (ver Decisão 1 e Risks).
- Resolver a ausência de fotos no endpoint de busca — é um limite do backend atual, documentado, não contornado aqui (ex.: não vamos fazer N chamadas a `GET /imoveis/{id}` só para pegar fotos).
- Implementar `/busca`, a página de detalhe do imóvel, ou os formulários por trás dos CTAs.

## Decisions

**1. Busca de "Selecionados para hoje" via Client Component + TanStack Query (não Server Component).**
Decisão tomada com o usuário: reusar o mesmo hook (`useImoveis`, espelhando `useHealthCheck`) tanto na Home quanto na futura Busca, em vez de ter dois caminhos de busca de dados diferentes no projeto (um server-side só pra Home, outro client-side só pra Busca). Trade-off aceito: a lista de imóveis não vem no HTML inicial, só depois do JS carregar — pior para SEO/crawlers nessa seção específica, mesmo o projeto tendo escolhido Next.js majoritariamente por causa de SEO. Ver Risks.

**2. Estrutura de componentes:**
- `src/components/property/PropertyCard.tsx` — componente apresentacional puro, recebe os dados já formatados (não faz fetch).
- `src/components/property/PropertyListing.tsx` — usa `useImoveis`, trata loading/erro/vazio, renderiza uma grade de `PropertyCard`. Reutilizável (Home hoje, Busca depois).
- `src/lib/api/hooks/use-imoveis.ts` — hook TanStack Query sobre `GET /imoveis`, aceita os mesmos query params do endpoint (ao menos `limit`).
- `src/lib/format.ts` — utilitário de formatação de preço (`Intl.NumberFormat` pt-BR/BRL) e metragem, para não duplicar formatação entre `PropertyCard` e futuras telas.
- Seções específicas da Home (Hero, atalhos de categoria, banners) ficam em `src/app/_home/*` (prefixo `_` do Next.js — colocado junto da rota, não vira uma rota) já que não são reutilizáveis fora da Home.
- `src/app/page.tsx` só compõe essas seções.

**3. Exibição de preço no card.**
`ImovelSummary` pode ter `valor_aluguel` e `valor_venda` simultaneamente (imóvel disponível para os dois). Regra: se `disponivel_aluguel`, exibe `valor_aluguel` com sufixo "/mês" e badge "Aluguel"; senão, se `disponivel_venda`, exibe `valor_venda` com badge "Venda". Um imóvel disponível para os dois exibe o badge/preço de aluguel como principal (consistente com a Home ser "Aluguel e Compra" mas o card mostrar uma operação por vez, como nos wireframes do Ciclo 03).

**4. Placeholder de imagem.**
Como `ImovelSummary` nunca traz foto (ver Context), `PropertyCard` sempre usa uma imagem placeholder estática (`public/property-placeholder.svg`, a criar) via `next/image`. Nenhuma lógica condicional de "foto real vs placeholder" é implementada agora — seria código morto até o backend expor foto no resumo.

**5. Navegação da busca e dos atalhos de categoria.**
Usa `useRouter().push()` (`next/navigation`) construindo a query string via `URLSearchParams` para `/busca?...`. Como a rota `/busca` não existe neste change, isso resulta em 404 do Next.js — comportamento esperado e documentado, não um bug a corrigir aqui.

## Risks / Trade-offs

- **[Risco] Lista de imóveis em destaque não aparece no HTML inicial (SEO)** → Mitigação: aceito conscientemente por ora (ver Decisão 1); se SEO dessa seção se mostrar um problema real, é uma migração isolada (trocar `PropertyListing` para buscar via Server Component) sem afetar as specs.
- **[Risco] Nenhum card mostra foto real hoje** → Mitigação: comportamento visível e consistente (todos usam o mesmo placeholder), documentado como limite do backend atual, não escondido.
- **[Trade-off] Links de busca/categoria/CTAs apontam para rotas ainda não implementadas (`/busca`, cadastro de imóvel)** → Aceito: são CTAs visuais desta fase; o 404 é esperado até os changes correspondentes.

## Open Questions

Nenhuma pendente que afete specs, abordagem ou tasks deste change.
