## 0. Pré-requisito (bloqueante)

- [x] 0.1 Conferir no `openapi.json` de produção que existem `POST /imoveis/{imovel_id}/verificar` e `/desverificar`, os valores `verificar`/`desverificar` em `ListingAction` e o parâmetro `verificado` em `GET /admin/imoveis`; rodar `npm run api:types` e `tsc`. Se o parâmetro do filtro não existir, retirar da change o requisito/cenário de filtro e a tarefa 2.2 (e o trecho do filtro na 2.3) antes de seguir

## 1. Ações de verificação

- [x] 1.1 `src/lib/imovel-labels.ts`: rótulos ("Verificar", "Remover verificação") e ordem das duas ações novas; `src/lib/api/hooks/use-moderar-imovel.ts`: os dois `POST` novos com as mesmas invalidações e recarga em erro; `tsc` sem erro
- [x] 1.2 `ImovelAdminLinha`: botões de verificação (estilo secundário, 44px no celular, sem confirmação) conforme `acoes_permitidas`, e selo "Verificado" ao lado do status

## 2. Lista

- [x] 2.1 Conferir que a lista reflete a nova situação após a ação e que `transicao_invalida` recarrega a lista (mensagem em português)
- [x] 2.2 `ImoveisAdminLista`: filtro "Verificação" (Todos / Verificados / Não verificados) mandando `verificado=true|false`, voltando à página 1
- [x] 2.3 Verificar no navegador (proxy simulando as rotas e o filtro): verificar e remover verificação, selo, filtro com a query string esperada, erro de situação mudada, imóvel sem a ação, status de publicação intacto

## 3. Fechamento

- [x] 3.1 Testar em 375px e 320px (lista com os botões novos) sem rolagem horizontal e botões com 44px; conferir o desktop
- [ ] 3.2 Verificar com a API real e uma conta staff: verificar um imóvel publicado e conferir que ele aparece na home ("Selecionados para hoje"); remover e conferir que sai
- [x] 3.3 Restaurar `.env.local`, parar proxy e servidor; `tsc --noEmit` e `eslint` sem erros
- [x] 3.4 `openspec validate add-listing-verification --strict` sem erros
