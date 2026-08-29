## 1. Trocar o critério

- [x] 1.1 Trocar `useVisitasDisponiveisEmBreve()` por `useImoveis({ verificado: true, limit: 4 })` em `src/app/_home/SelecionadosParaHoje.tsx`, remover o `nextVisitLabel` passado pro `PropertyCard`, e verificar no browser que a seção busca com o filtro correto (confirmar via requisição de rede ou dado retornado) — confirmado via `performance.getEntriesByType("resource")`: a requisição real foi `GET /imoveis?verificado=true&limit=4`
- [x] 1.2 Atualizar o texto da seção (título/subtexto em `src/app/page.tsx` e a mensagem de lista vazia em `SelecionadosParaHoje.tsx`) pra refletir o critério novo, e verificar visualmente no browser — confirmado: "Imóveis selecionados pela nossa equipe." e "Nenhum imóvel disponível no momento."
- [x] 1.3 Remover `src/lib/api/hooks/use-visitas-disponiveis-em-breve.ts` (sem uso após a troca), e verificar que o build continua passando — removido; também removido `formatProximaVisita` de `src/lib/format.ts`, que também ficou sem uso (mesmo princípio do design.md decisão 4); build limpo

## 2. Verificação final

- [x] 2.1 Rodar `npm run lint` e `npm run build` e verificar que ambos completam sem erro — ambos passam limpos
- [x] 2.2 Verificar que `PropertyListing.tsx`/`useImoveis`/as páginas `/alugar` e `/comprar` continuam funcionando exatamente como antes (sem regressão) — confirmado no browser: `/alugar` mostra os imóveis reais normalmente, sem filtro de `verificado`
- [x] 2.3 Verificar visualmente no browser que a Home carrega normalmente e que a seção mostra a mensagem de "nenhum imóvel" (esperado, já que nenhum imóvel real está verificado ainda) — documentar que o caminho "com imóveis reais" não é testável nesta sessão sem marcar algum imóvel como verificado no backend — confirmado: a Home carrega normalmente e mostra "Nenhum imóvel disponível no momento."; o caminho com imóveis reais não é testável nesta sessão porque nenhum dos 3 imóveis de seed está marcado como `verificado: true`
