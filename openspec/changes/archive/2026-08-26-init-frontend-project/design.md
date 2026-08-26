## Context

Hoje o repositório só tem o backend em produção (fora deste repo, no Railway) e a pasta `design_system/` com os PDFs de marca/tokens/telas. Não existe código de frontend nem estrutura de app. Este change decide a estrutura técnica de base; ver `proposal.md` para o porquê.

## Goals / Non-Goals

**Goals:**
- Deixar um esqueleto de projeto Next.js rodável (`dev`/`build`/`lint`) com o tema do Design System aplicado.
- Ter uma única fonte de verdade para os design tokens, consumível tanto pelo Tailwind quanto por bibliotecas não-Tailwind (ex.: MapLibre).
- Ter um client de API tipado que não fique dessincronizado do contrato real do backend sem que isso seja perceptível.

**Non-Goals:**
- Implementar qualquer página final (Home, Busca, Página do imóvel).
- Decidir o provedor de tiles/estilo de mapa da tela de Busca (só a lib base entra aqui).
- Autenticação ou qualquer rota autenticada.
- Pipeline automatizado de sincronização de tokens a partir dos PDFs do Design System (a extração dos valores é manual, feita uma vez, neste change).

## Decisions

**1. App único na raiz do repo, sem monorepo/Turborepo.**
O backend já existe e roda fora deste repositório (Railway); não há código de backend aqui para justificar um monorepo. Um único app Next.js na raiz mantém o setup simples. Alternativa considerada: monorepo com `apps/web` (ex.: via skill `config-project-fullstack`) — descartada porque essa skill assume backend NestJS local, que não é o nosso caso.

**2. Next.js App Router + TypeScript, com rotas em `src/app`.**
Necessário para SSR/SSG das páginas públicas (SEO dos anúncios), conforme já decidido na conversa com o usuário.

**3. Tokens do Design System como fonte única de verdade em `src/styles/tokens.css` (custom properties), consumidos pelo Tailwind via `@theme`.**
Definir os valores uma vez como CSS custom properties (`--color-petroleo-700`, `--space-4`, `--radius-md`, `--shadow-md`, `--motion-fast`, etc., extraídos de `design_system/Tokens.pdf` e `Conceito-de-marca.pdf`) evita duplicar os mesmos valores em `tailwind.config` e em qualquer lugar que precise do valor bruto em JS (ex.: estilo de camada do MapLibre, que não lê Tailwind). O Tailwind referencia essas variáveis; código não-Tailwind importa os mesmos valores de um módulo `src/styles/tokens.ts` gerado a partir do mesmo conjunto de números. Alternativa considerada: tokens só dentro de `tailwind.config` — descartada porque não são acessíveis fora do contexto Tailwind (MapLibre, canvas, etc.).

**4. shadcn/ui (sobre Radix UI) como base de componentes, copiado para `src/components/ui`.**
O design system já especifica estados (default/hover/active/focus/disabled/loading) e atributos ARIA por componente; shadcn/ui copia o código-fonte do componente para o repo (em vez de importar de um pacote fechado), permitindo restylizar cada estado exatamente como o Ciclo 02 especifica. Alternativa considerada: Radix puro sem shadcn — descartada por exigir escrever a estilização de cada estado do zero, com mais esforço sem ganho.

**5. Client de API: `openapi-typescript` gera apenas os tipos a partir do `openapi.json`; um wrapper fino de `fetch` em `src/lib/api/client.ts` usa esses tipos; hooks de dado ficam em `src/lib/api/hooks/*` usando TanStack Query.**
Gerar só tipos (não um client completo tipo `orval`) mantém a camada de rede simples e sob nosso controle, já que a API é relativamente pequena (auth, imóveis, condomínios, leads). Os tipos gerados ficam versionados em `src/lib/api/generated/` com um script `api:types` que baixa o `openapi.json` de produção e regenera — a regeneração é manual (não roda automaticamente no build), para o build não depender de rede externa disponível no momento do deploy.

**6. URL base da API via `NEXT_PUBLIC_API_BASE_URL`.**
Variável pública porque filtros de busca no client (Ciclo 03 - Busca) vão precisar disparar requisições diretamente do browser, não só via server components.

**7. MapLibre GL entra apenas como dependência + um componente wrapper vazio (`src/components/map/MapView.tsx`) que aceita `center`/`zoom`/`markers`, sem estilo de tiles definido.**
A escolha do provedor de tiles/estilo (ex.: MapTiler, um estilo自hospedado) é decisão de produto/custo que pertence ao change que implementar a tela de Busca, não a este setup.

**8. Lint/format: ESLint (`next/core-web-vitals` + TypeScript) e Prettier com `prettier-plugin-tailwindcss` para ordenar classes.**
Padrão do ecossistema Next.js, sem necessidade de ferramenta adicional.

## Risks / Trade-offs

- **[Risco] Tipos da API gerados manualmente podem ficar desatualizados em relação ao backend real** → Mitigação: script único `api:types` documentado no README; regenerar antes de iniciar qualquer change que consuma um endpoint novo ou alterado (o item 1 já aberto — "confirmar com o backend" — reforça isso).
- **[Risco] shadcn/ui copia código para o repo em vez de ser um pacote versionado** → atualizações de componente são manuais. Mitigação: aceito conscientemente — o ganho é controle total sobre os estados definidos no Design System.
- **[Risco] Extração manual dos valores numéricos dos tokens a partir dos PDFs pode introduzir erro de transcrição** (ex.: um valor de radius ou cor digitado errado) → Mitigação: `tasks.md` inclui uma tarefa explícita de conferência dos tokens transcritos contra `design_system/Tokens.pdf` e `Conceito-de-marca.pdf` antes de considerar o change concluído.
- **[Trade-off] MapLibre entra sem provedor de tiles configurado** → o componente wrapper não renderiza um mapa funcional ainda; isso é aceitável pois nenhuma página consome o mapa neste change.

## Open Questions

Nenhuma pendente que afete specs, abordagem ou tasks deste change. A escolha do provedor de tiles do MapLibre fica registrada como decisão em aberto para o change que implementar a tela de Busca (fora de escopo aqui).
