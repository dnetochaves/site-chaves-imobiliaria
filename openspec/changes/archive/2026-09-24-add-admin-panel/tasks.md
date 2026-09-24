## 1. Acesso restrito a staff

- [x] 1.1 Criar `src/app/admin/layout.tsx` com o guard por estado do `useAuth` (loading → "Carregando…"; unauthenticated → `login()`; autenticado sem `is_staff` → `notFound()`; staff → casca do painel com `children`); verificar `tsc`/`eslint` limpos
- [x] 1.2 Em `Header.tsx`, exibir o link "Admin" (→ `/admin`) somente quando autenticado e `user.is_staff === true`, no padrão do link "Favoritos"; verificar `tsc`/`eslint` limpos

## 2. Hooks de moderação

- [x] 2.1 Criar o hook de moderação (aprovar/pausar/rejeitar) em `src/lib/api/hooks/`, com `useMutation` + `toApiError`, que no sucesso atualiza `["imovel", id]` e invalida `["imoveis"]`; verificar `tsc` limpo (paths do `apiClient` tipados)

## 3. Telas do painel

- [x] 3.1 Criar `src/app/admin/page.tsx`: lista de imóveis publicados (reusa `useImoveis`) com título, localização e status, link para a tela de moderação, e estados de carregando/erro/vazio
- [x] 3.2 Na mesma página, campo "abrir imóvel por ID" que valida inteiro positivo, navega para `/admin/imoveis/{id}` e mostra mensagem para ID inválido
- [x] 3.3 Criar `src/app/admin/imoveis/[imovelId]/page.tsx`: mostra dados principais e status do imóvel (reusa `useImovelDetail`; "Imóvel não encontrado" quando 404) e botões Aprovar / Pausar / Rejeitar, desabilitados durante a ação, exibindo o novo status no sucesso e uma mensagem pt-BR (via `describeApiError`) no erro

## 4. Verificação

- [x] 4.1 No browser, sem login, acessar `/admin` e confirmar que o fluxo de login é iniciado e nenhum conteúdo do painel aparece; confirmar que o header público não mostra "Admin"
- [x] 4.2 Verificar o comportamento do guard para cada perfil (staff, autenticado sem staff, não autenticado) e os componentes do painel (lista, campo por ID, tela de moderação com sucesso e erro) por harness isolado temporário com dados simulados, removido ao final — login Google real com conta staff está fora do alcance do assistente; registrar no relatório o que só o usuário pode confirmar com uma conta staff real
- [x] 4.3 `tsc` e `eslint` limpos no projeto todo
