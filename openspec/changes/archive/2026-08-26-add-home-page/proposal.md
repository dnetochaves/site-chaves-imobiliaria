## Why

O change `init-frontend-project` entregou a base técnica (tokens, componentes shadcn, client de API tipado, TanStack Query), mas a rota `/` hoje é só uma página de vitrine dos componentes/tokens, não a Home real do site. É a primeira página pública que os usuários veem e a entrada principal para a busca de imóveis — sem ela, não há produto navegável.

## What Changes

- Substituir a página de vitrine em `src/app/page.tsx` pela Home real, seguindo o layout do Ciclo 03 do Design System (`design_system/sistema-montado.pdf`): hero com busca, "Selecionados para hoje", "Comece por onde tudo começa", banner de condomínios, CTA de cadastro de imóvel.
- Criar o componente **Property Card** (Ciclo 02, `design_system/Tokens.pdf`) como componente reutilizável em `src/components` (não acoplado à Home) — será reusado pela tela de Busca em um change futuro.
- Buscar imóveis reais via `GET /imoveis` (com `limit`) usando o client tipado + TanStack Query já existentes, tratando estados de loading, erro e lista vazia.
- Barra de busca e cards de categoria da Home capturam a intenção do usuário (local, tipo de operação) e navegam para `/busca?...` — a rota `/busca` **não é implementada neste change** (404 esperado, decisão consciente registrada em design.md).
- Banner de condomínios e CTA de "cadastrar imóvel" são apenas seções de marketing com link/CTA estático — os fluxos completos (formulário de submissão, painel do síndico) ficam para changes futuros.

**Fora de escopo**: autenticação, tela de Busca, página de detalhe do imóvel, formulário de submissão de imóvel, painel de gestão de condomínio.

## Capabilities

### New Capabilities
- `property-listing`: componente Property Card + busca de uma lista de imóveis via API (com estados de loading/erro/vazio) — capability reutilizável, não específica da Home.
- `home-page`: composição da página Home (hero, busca, atalhos de categoria, banners de CTA) e a navegação que ela dispara para `/busca`.

### Modified Capabilities
(nenhuma — Property Card é um componente novo, não uma mudança de requisito dos componentes base já especificados em `design-system-theming`)

## Impact

- **Código**: `src/app/page.tsx` (substituída), novo `src/components/property/PropertyCard.tsx`, novo hook `src/lib/api/hooks/use-imoveis.ts`, novas seções de Home em `src/app/_components` ou similar (detalhado em design.md).
- **API consumida**: `GET /imoveis` (tag `property-catalog`), já mapeada nos tipos gerados em `src/lib/api/generated/schema.ts`.
- **Dependências**: nenhuma nova — reusa Next.js, Tailwind, shadcn/ui, TanStack Query, client de API já instalados.
- **Navegação**: introduz links para `/busca` (rota inexistente até um change futuro) e para um fluxo de cadastro de imóvel (rota/ação também futura) — ambos como CTAs, sem implementar o destino.
