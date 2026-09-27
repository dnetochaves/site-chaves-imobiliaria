## 1. Labels e erros

- [x] 1.1 Criar `src/lib/corretor-labels.ts` com `CORRETOR_UF_OPTIONS` (27 UFs) e qualquer rótulo compartilhado (ex.: "Ativo"/"Inativo"); verificar que compila sem erro de tipos
- [x] 1.2 Adicionar `describeCorretorError` (409 CRECI duplicado, demais status genéricos) em um novo `src/lib/corretor-errors.ts`, e `describeAtribuicaoCorretorError` (409 corretor inativo) no mesmo arquivo

## 2. Hooks de leitura e cadastro

- [x] 2.1 `src/lib/api/hooks/use-corretores.ts`: `useCorretores({ ativo }: { ativo?: boolean })`, `queryKey: ["corretores", { ativo }]`, sobre `GET /corretores`
- [x] 2.2 `src/lib/api/hooks/use-criar-corretor.ts`: `useCriarCorretor()` sobre `POST /corretores`, invalida `["corretores"]` no sucesso
- [x] 2.3 `src/lib/api/hooks/use-atualizar-corretor.ts`: `useAtualizarCorretor(id)` sobre `PATCH /corretores/{corretor_id}` (só os campos alterados), invalida `["corretores"]`
- [x] 2.4 `src/lib/api/hooks/use-corretor-ativo.ts`: `useDesativarCorretor()` e `useReativarCorretor()` sobre os dois `POST` de desativar/reativar, cada um invalidando `["corretores"]`
- [x] 2.5 Verificar manualmente (proxy ou dados reais) que criar, editar, desativar e reativar atualizam a lista sem reload da página

## 3. Página de gestão de corretores

- [x] 3.1 `src/app/admin/corretores/page.tsx`: alternador "mostrar inativos" (usa `useCorretores`), campo de busca por nome filtrando a lista em memória, contagem total
- [x] 3.2 `src/app/admin/corretores/_components/CorretorLinha.tsx`: exibe nome, telefone, e-mail, CRECI (número + UF) e status; botão "Desativar"/"Reativar" conforme o estado, sem diálogo de confirmação
- [x] 3.3 `src/app/admin/corretores/_components/CorretorFormulario.tsx`: formulário de criar/editar (nome*, telefone*, e-mail, foto_url, creci_numero, creci_uf), usando `describeCorretorError` para o 409 nos campos de CRECI e mensagem de campo obrigatório para nome/telefone vazios
- [x] 3.4 Estados de carregando/vazio/erro na lista, seguindo o padrão de `src/app/admin/leads/page.tsx`
- [x] 3.5 Verificar no navegador: listar (ativos por padrão), alternar para incluir inativos, buscar por nome, cadastrar um corretor, editar um corretor, CRECI duplicado exibindo erro nos campos certos, desativar e reativar

## 4. Navegação do painel

- [x] 4.1 Adicionar "Corretores" a `SECTIONS` em `src/app/admin/layout.tsx`, apontando para `/admin/corretores`
- [x] 4.2 Verificar no navegador que a aba aparece, navega e fica marcada como ativa em `/admin/corretores`

## 5. Seletor de atribuição compartilhado

- [x] 5.1 `src/lib/api/hooks/use-atribuir-corretor-imovel.ts`: `useAtribuirCorretorImovel(imovelId)`, chamando `POST`/`DELETE /corretores/{corretor_id}/imoveis/{imovel_id}` conforme o valor (`corretorId: number` atribui, `null` remove), invalida `["imovel", imovelId]` e `["imoveis"]`
- [x] 5.2 `src/lib/api/hooks/use-atribuir-corretor-lead.ts`: `useAtribuirCorretorLead()`, recebendo `leadId` na chamada da mutação, mesmo padrão de `POST`/`DELETE /corretores/{corretor_id}/leads/{lead_id}`, invalida `["leads"]`
- [x] 5.3 `src/app/admin/corretores/_components/CorretorSeletor.tsx` (ou local compartilhado equivalente): recebe `corretorAtual: CorretorRef | null`, a lista de `useCorretores({ ativo: true })` e `onAtribuir(corretorId: number | null)`; exibe "Nenhum" quando não há corretor, um `<Select>` para escolher/trocar e uma ação para remover; mostra `describeAtribuicaoCorretorError` no 409 de corretor inativo, revertendo a seleção
- [x] 5.4 Verificar que o componente compila e renderiza os três estados (sem corretor, com corretor, erro de inativo) com dados simulados

## 6. Integrar o seletor nas telas existentes

- [x] 6.1 `src/app/admin/imoveis/[imovelId]/page.tsx`: usar `CorretorSeletor` com `useAtribuirCorretorImovel(imovel.id)`, exibindo o `imovel.corretor` atual
- [x] 6.2 `src/app/admin/leads/_components/LeadRow.tsx`: usar `CorretorSeletor` com `useAtribuirCorretorLead()`, exibindo o `lead.corretor` atual
- [x] 6.3 Verificar no navegador: atribuir, trocar e remover o corretor em um imóvel e em um lead; tentar atribuir um corretor inativo e ver a mensagem de erro

## 7. Fechamento

- [x] 7.1 Testar em 375px e 320px: `/admin/corretores` sem rolagem horizontal, botões "Desativar"/"Reativar" com 44px de altura, aba "Corretores" com 44px; conferir que o desktop não regrediu
- [x] 7.2 Rodar `tsc --noEmit` e `eslint` no projeto inteiro sem erros
- [x] 7.3 Rodar `openspec validate add-admin-corretores --strict` sem erros
