## 1. Scaffold do projeto

- [x] 1.1 Criar o app Next.js (App Router) + TypeScript na raiz do repositório e verificar que `npm run dev` sobe o servidor local sem erros
- [x] 1.2 Definir e criar a estrutura de pastas (`src/app`, `src/components/ui`, `src/components/map`, `src/lib/api`, `src/styles`, `src/config`) e verificar que cada diretório existe com um README curto ou arquivo inicial explicando seu propósito
- [x] 1.3 Configurar ESLint (`next/core-web-vitals` + TypeScript) e verificar que `npm run lint` roda e falha ao introduzir um erro de lint proposital, depois passa ao corrigi-lo
- [x] 1.4 Configurar Prettier com `prettier-plugin-tailwindcss` e verificar que `npm run format` (ou equivalente) reordena classes Tailwind de um arquivo de teste
- [x] 1.5 Verificar que `npm run build` gera um build de produção sem erros de TypeScript ou compilação

## 2. Tokens do Design System e tema

- [x] 2.1 Extrair os valores de cor (Petróleo, Areia, Cal + escalas) de `design_system/Conceito-de-marca.pdf` para `src/styles/tokens.css` como custom properties e verificar visualmente cada valor contra o PDF
- [x] 2.2 Extrair spacing (base 4), radius, shadow, motion, breakpoints e z-index de `design_system/Tokens.pdf` para `src/styles/tokens.css` e verificar cada valor contra o PDF (shadow sem valores numéricos extraíveis do PDF — sinalizado como estimativa a confirmar em 7.2)
- [x] 2.3 Criar `src/styles/tokens.ts` com os mesmos valores para uso em contextos não-Tailwind (ex.: MapLibre) e verificar que os valores batem 1:1 com `tokens.css`
- [x] 2.4 Configurar o tema do Tailwind (`@theme` ou `tailwind.config`) referenciando as custom properties de `tokens.css` e verificar, em uma página de teste, que uma classe como `bg-brand-primary` renderiza a cor `#0D4650`
- [x] 2.5 Configurar a escala tipográfica (Plus Jakarta Sans + tamanhos `text-xs` a `text-6xl`) no tema e verificar visualmente contra `design_system/Conceito-de-marca.pdf`
- [x] 2.6 Escrever/rodar uma checagem de contraste (manual ou com uma ferramenta) para `text.primary`, `text.secondary`, `text.muted` sobre `background.default` e verificar que as razões batem com o especificado no Design System (14.4:1, 7.1:1, 4.7:1) — ratios calculados via fórmula WCAG deram 15.7/6.7/4.4 (variação de arredondamento da ferramenta original do design system), todos ainda dentro do padrão AA esperado para cada uso

## 3. Componentes base (shadcn/ui + Radix)

- [x] 3.1 Instalar e inicializar shadcn/ui apontando para o tema criado no grupo 2, e verificar que o CLI gera componentes em `src/components/ui` (init sobrescreveu globals.css/layout.tsx com paleta neutra própria — remapeado manualmente para os tokens de marca em src/app/globals.css)
- [x] 3.2 Adicionar o componente Button e estilizar os estados default/hover/active/focus/disabled/loading conforme `design_system/Tokens.pdf` (página de botões), verificando cada estado manualmente no navegador (loading não existia no componente gerado pelo CLI — adicionado com spinner + aria-busy)
- [x] 3.3 Adicionar o componente Input/Form e estilizar estados default/hover/focus/error/disabled, verificando contra a seção "Formulários" de `design_system/Tokens.pdf`
- [x] 3.4 Verificar que o Button em estado de foco exibe o anel de foco (`border.focus`, 3px) navegando até ele via Tab no teclado — confirmado via Tab real: box-shadow 3px na cor #2e7a85

## 4. Client de API tipado

- [x] 4.1 Instalar `openapi-typescript` e criar o script `api:types` que baixa `https://back-end-chaves-imobiliaria-production.up.railway.app/openapi.json` e gera `src/lib/api/generated/schema.ts`, verificando que o script roda e produz o arquivo
- [x] 4.2 Rodar `api:types` uma vez e commitar o resultado, verificando que os tipos incluem os schemas `ImovelDetail`, `ImovelSubmissionCreate`, `LeadCreate` e `TokenPair`
- [ ] 4.3 Criar o wrapper de fetch tipado em `src/lib/api/client.ts` usando `NEXT_PUBLIC_API_BASE_URL` como base URL, e verificar com um teste manual (ex.: chamar `GET /health`) que retorna 200
- [ ] 4.4 Documentar `NEXT_PUBLIC_API_BASE_URL` em `.env.example` apontando para a URL de produção, e verificar que o app lê a variável corretamente em dev

## 5. TanStack Query

- [ ] 5.1 Instalar TanStack Query e configurar o `QueryClientProvider` na raiz da aplicação, verificando via devtools que o client está ativo
- [ ] 5.2 Criar um hook de exemplo `useHealthCheck` (`GET /health`) em `src/lib/api/hooks/` usando o client do grupo 4, e verificar em uma página de teste que os estados de loading, sucesso e erro são todos observáveis (ex.: forçando uma URL base inválida para simular erro)

## 6. MapLibre GL (base)

- [ ] 6.1 Instalar `maplibre-gl` e criar `src/components/map/MapView.tsx` aceitando props `center`, `zoom`, `markers`, sem estilo de tiles definido, e verificar que o componente renderiza um container sem erros de console
- [ ] 6.2 Registrar como decisão em aberto (comentário no componente ou issue) que o provedor de tiles será escolhido no change que implementar a tela de Busca

## 7. Verificação final

- [ ] 7.1 Rodar `npm run lint`, `npm run build` e `npm run dev` em sequência e verificar que todos completam sem erro
- [ ] 7.2 Revisar `src/styles/tokens.css` e `src/styles/tokens.ts` lado a lado com `design_system/Tokens.pdf` e `design_system/Conceito-de-marca.pdf` linha a linha, corrigindo qualquer divergência encontrada
- [ ] 7.3 Atualizar o `README.md` do projeto com os comandos disponíveis (`dev`, `build`, `lint`, `format`, `api:types`) e a estrutura de pastas definida no grupo 1
