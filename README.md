# site-chaves-imobiliaria

Frontend do site Chaves Imobiliária — Next.js (App Router) + TypeScript, com o tema Tailwind derivado dos design tokens em [`design_system/`](design_system/) e um client tipado para a [API do backend](https://back-end-chaves-imobiliaria-production.up.railway.app/docs).

## Comandos

```bash
npm run dev          # servidor de desenvolvimento (http://localhost:3000)
npm run build        # build de produção
npm run start        # roda o build de produção
npm run lint         # ESLint
npm run format       # Prettier (com prettier-plugin-tailwindcss)
npm run format:check # Prettier em modo check
npm run api:types    # regenera src/lib/api/generated/schema.ts a partir do openapi.json do backend
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e ajuste se necessário:

```bash
cp .env.example .env.local
```

`NEXT_PUBLIC_API_BASE_URL` — URL base da API. O backend em produção só libera CORS para origens explicitamente cadastradas em `ALLOWED_ORIGINS` (hoje: a URL de produção do frontend e `http://localhost:3000`).

## Estrutura de pastas

```
src/
  app/              rotas públicas (Next.js App Router)
  components/
    ui/             componentes base do shadcn/ui (sobre Radix UI)
    map/            componentes do MapLibre GL
  lib/
    api/            client de API tipado
      generated/    tipos gerados do OpenAPI (não editar manualmente)
      hooks/        hooks de TanStack Query
  styles/           design tokens (tokens.css + tokens.ts) — fonte única de verdade
  config/           leitura centralizada de variáveis de ambiente
```

## Design System

Os PDFs em [`design_system/`](design_system/) são a fonte de verdade da marca e dos tokens visuais. Qualquer atualização de cor/tipografia/spacing deve ser refletida manualmente em `src/styles/tokens.css` e `src/styles/tokens.ts`.
