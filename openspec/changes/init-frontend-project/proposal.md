## Why

O projeto Chaves Imobiliária hoje tem apenas o backend em produção (API REST/OpenAPI no Railway) e o Design System (marca, tokens, telas). Não existe ainda nenhum projeto de frontend. Antes de implementar qualquer tela, é preciso inicializar a base técnica — framework, estilização a partir dos tokens do design system, camada de acesso à API tipada e as ferramentas de UI — para que as próximas mudanças (Home, Busca, Página do imóvel) partam de uma fundação consistente em vez de decisões ad-hoc por página.

## What Changes

- Criar o projeto Next.js (App Router) + TypeScript na raiz do repositório (ou em `apps/web`, a definir em design.md).
- Configurar Tailwind CSS com um tema derivado dos design tokens do Ciclo 01/02 (`design_system/`): cores (Petróleo `#0D4650`, Areia `#D2954F`, Cal `#F8F7F4` + escalas), spacing base-4, radius, shadow, motion (durações/easings), breakpoints e z-index.
- Instalar e configurar shadcn/ui sobre Radix UI como base de componentes acessíveis (estados default/hover/active/focus/disabled/loading já especificados no design system).
- Gerar um client de API TypeScript tipado a partir do `openapi.json` do backend (`https://back-end-chaves-imobiliaria-production.up.railway.app/openapi.json`), com script de regeneração dos types.
- Configurar TanStack Query (provider, query client) para data-fetching sobre esse client.
- Instalar e configurar MapLibre GL como base para a futura tela de Busca com mapa (sem implementar a tela em si).
- Definir estrutura de pastas do projeto (rotas públicas, componentes, lib de API, tokens/tema).
- Configurar lint/format (ESLint + Prettier) e scripts básicos (`dev`, `build`, `lint`).

Fora de escopo deste change: implementação das páginas (Home, Busca, Página do imóvel), autenticação/áreas logadas, e qualquer feature que dependa de confirmação com o backend (favoritar/comparar imóveis).

## Capabilities

### New Capabilities
- `frontend-project-setup`: inicialização do projeto Next.js/TypeScript, estrutura de pastas, tooling de lint/format e scripts de desenvolvimento.
- `design-system-theming`: tradução dos design tokens (cores, tipografia, spacing, radius, shadow, motion, breakpoints, z-index) para configuração Tailwind + biblioteca de componentes base (shadcn/ui sobre Radix).
- `typed-api-client`: geração e manutenção de um client de API tipado a partir do OpenAPI spec do backend, integrado ao TanStack Query.

### Modified Capabilities
(nenhuma — projeto novo, sem specs existentes)

## Impact

- **Novo código**: todo o projeto frontend (não existe hoje).
- **Dependências novas**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, TanStack Query, MapLibre GL, `openapi-typescript` (ou equivalente).
- **Sistemas externos**: consome a API já em produção no Railway (somente leitura de contrato via `openapi.json`; nenhuma mudança no backend).
- **Design System**: os PDFs em `design_system/` passam a ser a fonte de verdade para o tema Tailwind — qualquer atualização de marca/tokens deve ser refletida manualmente nessa configuração até existir um pipeline automatizado (fora de escopo aqui).
