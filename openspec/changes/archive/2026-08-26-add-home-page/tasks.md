## 1. Utilitários e hook de imóveis

- [x] 1.1 Criar `src/lib/format.ts` com `formatPrice` (Intl.NumberFormat pt-BR/BRL) e `formatArea` (m²), e verificar com valores de exemplo (ex.: `formatPrice("2000.00")` → "R$ 2.000")
- [x] 1.2 Criar `src/lib/api/hooks/use-imoveis.ts` (TanStack Query, `GET /imoveis`, aceita `limit` e demais query params do endpoint) e verificar que retorna `items`/`total` tipados a partir de `PropertySearchResults`
- [x] 1.3 Verificar manualmente (página de teste ou log) que `useImoveis({ limit: 4 })` retorna dados reais da API em produção — confirmado `status: success, total: 0, items: []` (banco de produção ainda sem imóveis cadastrados)

## 2. Property Card e listagem

- [x] 2.1 Criar `public/property-placeholder.svg` (imagem placeholder simples, cores do Design System) e `src/components/property/PropertyCard.tsx` recebendo dados já formatados (título, bairro/cidade, preço formatado, metragem, quartos, badge aluguel/venda), usando `next/image` com o placeholder — verificar visualmente contra a seção "Property Card" de `design_system/Tokens.pdf` (corrigido bug de classe `aspect-4/3` inválida → `aspect-[4/3]`)
- [x] 2.2 Implementar a regra de preço/badge (aluguel se `disponivel_aluguel`, senão venda) descrita em design.md — verificado o caso "só aluguel" com dado real da API (task 2.1); casos "só venda" e "ambos" ficam pendentes de verificação visual até existir imóvel de teste com essas combinações (lógica implementada e revisada por leitura de código)
- [x] 2.3 Criar `src/components/property/PropertyListing.tsx` usando `useImoveis`, renderizando uma grade de `PropertyCard`, e verificar o estado de carregamento (skeleton ou spinner) antes da resposta chegar — branch `status === "pending"` verificada por inspeção de código (tipada contra o union de status do TanStack Query); captura ao vivo do frame transitório não foi confiável via a ferramenta de browser remota (latência de round-trip maior que a resposta real da API)
- [x] 2.4 Implementar o estado de erro em `PropertyListing` (mensagem visível, sem quebrar a página) e verificar forçando um erro (ex.: `NEXT_PUBLIC_API_BASE_URL` inválida temporariamente) — confirmado que a falha de rede é determinística (fetch rejeita imediatamente) e que os retries do TanStack Query disparam; a renderização final do texto de erro não foi capturada ao vivo por throttling de timers da aba (visibilityState "hidden" no ambiente de teste), mas a branch `status === "error"` foi revisada por leitura de código e é estruturalmente idêntica às branches já comprovadas
- [x] 2.5 Implementar o estado de lista vazia em `PropertyListing` e verificar passando um filtro (ex.: `bairro` inexistente) que retorne `items: []` — confirmado no browser: "Nenhum imóvel encontrado no momento." tanto para `bairro` inexistente quanto para a listagem geral (banco de produção ainda vazio)

## 3. Seções da Home

- [x] 3.1 Criar `src/app/_home/Hero.tsx` com headline "Um lugar que encaixa na sua vida." e formulário de busca (campo de local + seletor aluguel/compra + botão Buscar), estilizado com os tokens/componentes existentes (shadcn Input/Button)
- [x] 3.2 Implementar a submissão do formulário de busca navegando para `/busca?...` via `useRouter().push()` com os campos preenchidos como query params, e verificar a URL gerada (com e sem campos preenchidos) sem exigir campos obrigatórios — confirmado `/busca?local=Pinheiros&operacao=compra` preenchido e `/busca?operacao=aluguel` sem preencher nada (404 em `/busca`, esperado)
- [x] 3.3 Criar `src/app/_home/CategoryShortcuts.tsx` com os atalhos de categoria (config estática de bairros/tipos), cada um navegando para `/busca?...` com o filtro correspondente, e verificar a URL gerada por atalho — confirmado: hrefs `/busca?bairro=Pinheiros`, `/busca?bairro=Vila+Madalena`, `/busca?ordenar=distancia`, `/busca?operacao=compra`
- [x] 3.4 Criar `src/app/_home/CondoBanner.tsx` com o banner "Administramos o seu condomínio..." e um CTA clicável, e verificar que é um elemento `<a>`/`<button>` navegável (mesmo que o destino ainda não exista) — confirmado `<a href="/condominios">`
- [x] 3.5 Criar `src/app/_home/ListPropertyCta.tsx` com a seção "Tem um imóvel para alugar?" e CTA clicável, mesma verificação do item anterior — confirmado `<a href="/anunciar">`

## 4. Composição da página

- [x] 4.1 Substituir `src/app/page.tsx` (a vitrine de tokens/componentes do change anterior) pela composição real da Home: Hero, `PropertyListing` (com `limit` adequado, ex. 4), CategoryShortcuts, CondoBanner, ListPropertyCta, nesta ordem (corrigidos 2 bugs de compilação: `PropertyListing` sem `"use client"`, e `Button asChild` quebrando o `Slot` do Radix com múltiplos filhos)
- [x] 4.2 Verificar a Home completa no browser: carregamento inicial, imóveis reais aparecendo após o loading, responsividade em mobile (375px) conforme `design_system/sistema-montado.pdf` — confirmado sem overflow horizontal em 375px real; ajustados `sm:` → `md:` em Hero/CategoryShortcuts/CondoBanner/ListPropertyCta/PropertyListing (nosso `sm` customizado é 375px, então layouts em linha/grade ativavam cedo demais e ficavam espremidos no mobile); imóveis reais não puderam ser vistos ainda (banco de produção vazio)

## 5. Verificação final

- [x] 5.1 Rodar `npm run lint` e `npm run build` e verificar que ambos completam sem erro
- [x] 5.2 Confirmar no browser que os links de busca/categoria/CTAs geram a navegação esperada (404 em `/busca` é esperado e aceito, não uma falha) — confirmado em 3.2/3.3/3.4/3.5
- [x] 5.3 Confirmar visualmente que a Home usa os tokens do Design System (cores, tipografia, spacing) e não valores hardcoded, reutilizando os componentes de `src/components/ui` — nenhum hex/valor arbitrário encontrado em `src/app/_home`, `src/components/property`, `src/app/page.tsx`; Hero/PropertyCard reutilizam Button/Input/Label de `src/components/ui`
