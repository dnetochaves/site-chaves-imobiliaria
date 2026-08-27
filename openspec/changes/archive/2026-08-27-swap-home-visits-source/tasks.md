## 1. Dados

- [x] 1.1 Criar `src/lib/api/hooks/use-visitas-disponiveis-em-breve.ts` (`useVisitasDisponiveisEmBreve()`, `GET /visitas/disponiveis-em-breve`, seguindo o padrão de `use-imoveis.ts`), e verificar que retorna dados reais no browser — confirmado, renderizou o imóvel real com visita disponível (id 1)
- [x] 1.2 Criar `formatProximaVisita(isoDate: string): string` em `src/lib/format.ts` (hoje/amanhã/data), e verificar com um horário de hoje e um de amanhã — caso "amanhã" confirmado no browser com dado real ("Visita amanhã às 14:05"); os 3 ramos (hoje/amanhã/outra data) testados diretamente com datas sintéticas, todos corretos

## 2. Componente da Home

- [x] 2.1 Adicionar prop opcional `nextVisitLabel?: string` a `PropertyCard.tsx`, renderizada como badge quando presente, e verificar que o comportamento sem a prop continua igual (sem regressão nos outros usos do card) — confirmado: cards da Busca (que não passam a prop) continuam sem o badge, sem alteração
- [x] 2.2 Criar `src/app/_home/SelecionadosParaHoje.tsx`: busca via `useVisitasDisponiveisEmBreve`, corta em 4 itens, renderiza `PropertyCard` com `toPropertyDisplayData(item.imovel)` e `nextVisitLabel`, e verificar com dados reais no browser — confirmado no browser
- [x] 2.3 Implementar os estados de carregamento, erro e lista vazia (mensagem "Nenhum imóvel com visita disponível no momento", sem esconder a seção), e verificar os 3 casos — carregamento e a lista com 1 item real verificados no browser; erro e lista vazia verificados por revisão de código (mesmo padrão já usado e testado em `PropertyListing`)
- [x] 2.4 Substituir `<PropertyListing limit={4} />` por `<SelecionadosParaHoje />` em `src/app/page.tsx`, e verificar que a Home carrega normalmente — confirmado no browser, Home carrega e mostra o imóvel real com visita disponível

## 3. Verificação final

- [x] 3.1 Rodar `npm run lint` e `npm run build` e verificar que ambos completam sem erro — ambos passam limpos
- [x] 3.2 Verificar que `PropertyListing.tsx`, `useImoveis` e a página `/busca` continuam funcionando exatamente como antes (sem regressão) — confirmado no browser: `/busca` mostra os 2 imóveis normalmente, nenhum arquivo desses foi tocado
- [x] 3.3 Verificar que nenhum valor hardcoded (hex, cor fora do tema) foi introduzido, e que os componentes reutilizam `Button`/estilos já existentes de `src/components/ui` e `PropertyCard` — `grep` por hex não encontrou nada; o badge de próxima visita reaproveita o mesmo padrão de pill já usado nos outros badges do `PropertyCard`
