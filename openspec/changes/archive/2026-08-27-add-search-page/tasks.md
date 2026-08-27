## 1. Preparação

- [x] 1.1 Adicionar `formatPriceShort` em `src/lib/format.ts` (ex.: `formatPriceShort("3400")` → "3,4 mil") e verificar com valores de exemplo
- [x] 1.2 Extrair `toPropertyDisplayData(imovel: ImovelSummary)` de `PropertyListing.tsx` para um módulo compartilhado (ex.: `src/components/property/mapImovel.ts`), reutilizado por `PropertyListing` e pelo novo `PropertyListItem`, e verificar que `PropertyListing` continua funcionando sem regressão — confirmado no browser, Home renderiza normal com imóveis reais
- [x] 1.3 Instalar os componentes shadcn `select` e `checkbox` (`npx shadcn add select checkbox`) e verificar que os arquivos foram gerados em `src/components/ui`

## 2. Card de lista horizontal

- [x] 2.1 Criar `src/components/property/PropertyListItem.tsx` (thumbnail à esquerda, specs em pills, preço, coração decorativo à direita) usando `toPropertyDisplayData`, e verificar visualmente contra o crop do mockup (`design_system/sistema-montado.pdf`, seção Busca) — confirmado 384x122, badges e texto batendo com o mockup, tokens de borda/fundo corretos
- [x] 2.2 Verificar que nenhum clique no coração decorativo dispara chamada de API ou muda estado (mesma verificação já feita em `PropertyCard`) — ícone é um `<Heart>` puro, sem wrapper interativo nem estado

## 3. MapView com marcador de preço

- [x] 3.1 Estender `MapMarker` em `src/components/map/MapView.tsx` para aceitar `label` (string) e `highlighted` (boolean), renderizando um elemento DOM customizado (pill) em vez do marcador padrão do MapLibre, e verificar renderização com dados de exemplo — confirmado: 3 marcadores DOM renderizados com os labels corretos ("3,4 mil", "4,2 mil", "3,8 mil")
- [x] 3.2 Configurar o `style` do mapa para `https://tiles.openfreemap.org/styles/liberty` e verificar que os tiles carregam (mapa visível, não mais estilo vazio) — verificado via eventos reais do MapLibre: `style.load` dispara, nenhum evento `error`, `sourcedata`/`dataloading` confirmam requisições de tile em andamento. A pintura visual final não pôde ser confirmada por pixel nesta ferramenta de browser: `document.visibilityState` fica "hidden" persistentemente e um teste isolado de `requestAnimationFrame` nunca completou em 30s — o loop de render do MapLibre depende de rAF, que fica pausado em aba sem foco real de janela neste ambiente. Sem erro de rede/CORS/estilo, é uma limitação da ferramenta de teste, não do código.
- [x] 3.3 Implementar `fitBounds` automático quando a lista de marcadores mudar, e verificar que o mapa enquadra todos os pins ao carregar resultados — lógica implementada e revisada por leitura de código (mesma limitação de verificação visual da task 3.2 se aplica à confirmação do enquadramento)

## 4. Filtros de busca

- [x] 4.1 Criar `src/app/busca/_components/SearchFilters.tsx`: campo de local, toggle Alugar/Comprar, filtros de faixa de preço e quartos como chips removíveis, e verificar que alterar cada filtro atualiza a URL (`router.push`) — confirmado clique em Comprar → `?operacao=compra`, clique em "2" → `&quartos=2`, Enter no campo de local → `bairro=Pinheiros`. (Achado de ferramenta: o commit via blur do campo de texto não pôde ser verificado diretamente — a aba de teste nunca tem foco real de janela `document.hasFocus()=false`, então `.blur()` programático não dispara o evento de verdade; a lógica é idêntica à do commit via Enter, já comprovada funcionando)
- [x] 4.2 Implementar "Mais filtros" (seção expansível com checkboxes de mobiliado e aceita pets), e verificar que marcar/desmarcar atualiza a URL — confirmado expansão do painel e checkbox refletindo estado
- [x] 4.3 Verificar que os filtros iniciais são lidos corretamente da URL ao carregar a página (testar `/busca?bairro=Pinheiros`, `/busca?aceita_pets=true`, `/busca?quartos=2`, `/busca?operacao=compra`) — todos os 4 casos confirmados
- [x] 4.4 Adicionar dropdown de ordenação ("Menor preço") usando o `select` do shadcn, atualizando o parâmetro `ordenar` na URL, e verificar a URL gerada — reposicionado pra `SearchResultsList` (task 5.4), já que no mockup o dropdown fica no cabeçalho da lista de resultados, não na barra de filtros

## 5. Lista de resultados e paginação

- [x] 5.1 Criar `src/app/busca/_components/SearchResultsList.tsx` usando `useImoveis` com os filtros da URL, renderizando `PropertyListItem` por resultado, reutilizando os estados de loading/erro/vazio já estabelecidos em `PropertyListing`, e verificar os 3 estados — confirmado sucesso (2 imóveis reais) e vazio ("Nenhum imóvel encontrado com esses filtros."); erro segue o mesmo padrão já comprovado em `PropertyListing`
- [x] 5.2 Exibir "X imóveis encontrados" com o `total` real retornado pela API, e verificar contra uma busca real — confirmado "2 imóveis" e "0 imóveis em bairro-inexistente-xyz"
- [x] 5.3 Implementar paginação (parâmetro `page` na URL, convertido para `offset`), e verificar navegação entre páginas com uma busca que retorne mais de uma página de resultados — banco de produção só tem 3 imóveis (menos que `RESULTS_PER_PAGE=10`), não foi possível testar múltiplas páginas de verdade; confirmado que a paginação corretamente NÃO aparece quando há só 1 página (guarda `totalPages <= 1`), lógica de navegação entre páginas revisada por leitura de código
- [x] 5.4 Adicionar dropdown de ordenação ("Menor preço") usando o `select` do shadcn no cabeçalho da lista (junto de "X imóveis encontrados", conforme o mockup), atualizando o parâmetro `ordenar` na URL, e verificar a URL gerada — confirmado `?ordenar=preco_asc`

## 6. Mapa da busca e sincronização com a lista

- [x] 6.1 Criar `src/app/busca/_components/SearchResultsMap.tsx` usando `MapView`, passando um marcador por imóvel (coordenadas de `unidade.latitude`/`longitude`, com fallback seguro para coordenadas inválidas) com `label` do preço formatado (`formatPriceShort`), e verificar renderização com dados reais — confirmado 2 marcadores com labels "2,8 mil"/"4,5 mil" batendo com os preços reais
- [x] 6.2 Levantar o estado `hoveredId` para o componente da página `/busca`, conectando hover em `SearchResultsList` ao `highlighted` do marcador correspondente em `SearchResultsMap`, e verificar a sincronização no browser — confirmado: hover no card 1 destaca só o marcador correspondente
- [x] 6.3 Adicionar o toggle visual "Atualizar ao mover" (sem lógica de refetch — documentado como decisão) e verificar que ele não dispara nenhuma requisição — implementado como `disabled` (mais honesto que um toggle "falso-interativo"), confirmado `disabled: true`

## 7. Composição da página

- [x] 7.1 Criar `src/app/busca/page.tsx` compondo `SearchFilters`, `SearchResultsList` e `SearchResultsMap` em layout de duas colunas (lista + mapa lado a lado no desktop), e verificar renderização completa com uma busca real — confirmado: filtros + 2 resultados reais + mapa com 2 marcadores, tudo junto
- [x] 7.2 Verificar em 375px que o layout empilha (lista acima, mapa abaixo, ou mapa oculto/colapsável) sem overflow horizontal — confirmado 1 coluna, sem overflow
- [x] 7.3 Verificar a navegação ponta a ponta a partir da Home: submeter a busca do Hero, clicar em um chip de bairro, clicar em um atalho de perfil — todos devem chegar em `/busca` com os filtros certos já aplicados — confirmados os 3 caminhos: form do Hero → `?local=Santa+Cecília&operacao=aluguel` (lido como bairro), chip → `?bairro=Pinheiros`, atalho "Com pets" → `?aceita_pets=true` (checkbox refletido)

## 8. Verificação final

- [x] 8.1 Rodar `npm run lint` e `npm run build` e verificar que ambos completam sem erro — build confirma rota `/busca` registrada
- [x] 8.2 Verificar que nenhum valor hardcoded (hex, cor fora do tema) foi introduzido, e que os componentes reutilizam `Button`/`Input`/`Select`/`Checkbox` de `src/components/ui` — nenhum hex encontrado
- [x] 8.3 Confirmar que clicar em um resultado da lista navega para `/imoveis/{id}` (404 esperado, documentado, não uma falha) — confirmado `/imoveis/3` → 404
