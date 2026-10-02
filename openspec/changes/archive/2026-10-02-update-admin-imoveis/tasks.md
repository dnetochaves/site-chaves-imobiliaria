## 1. Labels, erros e hooks

- [x] 1.1 `src/lib/imovel-labels.ts`: opções de status em português (rascunho, em análise, publicado, pausado, alugado, vendido, removido) e rótulos das ações (aprovar, pausar, rejeitar, republicar); `tsc` sem erro
- [x] 1.2 `src/lib/imovel-errors.ts`: helper por `error.code` (`transicao_invalida`, `unidade_ja_tem_anuncio_ativo`, demais via `describeApiError`); verificar com erros simulados
- [x] 1.3 `src/lib/api/hooks/use-admin-imoveis.ts`: `useAdminImoveis(params)` sobre `GET /admin/imoveis`, chave `["admin-imoveis", params]`
- [x] 1.4 `use-moderar-imovel.ts`: acrescentar a ação `republicar` (`POST /imoveis/{id}/republicar`) e invalidar `["admin-imoveis"]`; `use-atribuir-corretor-imovel.ts`: invalidar `["admin-imoveis"]` nas duas mutações

## 2. Lista de imóveis do painel

- [x] 2.1 `ImoveisAdminLista`: filtros (status, corretor com "Sem corretor", busca por texto, ordenação mais novos/mais antigos), paginação de 20, contagem total e estados de carregando/vazio/erro; nunca enviar `corretor_id` junto com `sem_corretor`
- [x] 2.2 `ImovelAdminLinha`: capa, título, endereço, status em português, data, link para o detalhe e `CorretorSeletor` (atribuir/trocar/remover)
- [x] 2.3 Ações de publicação: um botão por valor de `acoes_permitidas` (44px no celular), confirmação em `Dialog` para pausar e rejeitar, aviso de visitas agendadas ao pausar, nota para pausado sem ações, erros por `error.code` (recarregando a lista em `transicao_invalida`)
- [x] 2.4 `src/app/admin/page.tsx`: lista no topo e "Abrir imóvel por ID" abaixo
- [x] 2.5 Verificar no navegador (proxy simulando `/admin/imoveis`): lista de todos os status, cada filtro e a ordenação com a query string esperada, paginação, estados vazio/erro

## 3. Ações e corretor na prática

- [x] 3.1 Verificar no navegador: aprovar, pausar (com e sem visitas agendadas), rejeitar, republicar, desistir da confirmação, `transicao_invalida`, `unidade_ja_tem_anuncio_ativo`, imóvel sem ações e pausado sem ações
- [x] 3.2 Verificar no navegador: atribuir, trocar e remover corretor pela lista, e o detalhe refletindo o corretor

## 4. Detalhe do imóvel

- [x] 4.1 `src/app/admin/imoveis/[imovelId]/page.tsx`: remover os botões de moderação, exibir o status em português, manter seletor de corretor e acrescentar o link "← Voltar à lista"; verificar no navegador

## 5. Fechamento

- [x] 5.1 Testar em 375px e 320px (`/admin` e `/admin/imoveis/{id}` sem rolagem horizontal, botões de publicação com 44px) e conferir o desktop
- [x] 5.2 Restaurar `.env.local`, parar proxy e servidor; rodar `tsc --noEmit` e `eslint` sem erros
- [x] 5.3 `openspec validate update-admin-imoveis --strict` sem erros
