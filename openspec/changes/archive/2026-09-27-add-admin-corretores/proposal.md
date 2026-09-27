## Why

A equipe já pode gerenciar imóveis, leads e visitas no painel administrativo, mas não tem como cadastrar corretores parceiros nem atribuí-los a um imóvel ou a um lead. O back-end já expõe esses endpoints em produção (`/corretores` e as rotas de atribuição), então falta só a tela no painel.

## What Changes

- Nova seção "Corretores" no painel administrativo (`/admin/corretores`), com lista (toggle "mostrar inativos", busca por nome no front), formulário de criar/editar e ação de desativar/reativar (sem confirmação destrutiva, pois não é exclusão real).
- Seletor de corretor na tela de moderação de imóvel (`/admin/imoveis/{id}`) e em cada lead da lista de leads, mostrando o corretor já atribuído (campo `corretor` que a API já retorna) e permitindo atribuir ou remover a atribuição.
- Tratamento de erro específico do cadastro de corretor: 409 de CRECI duplicado como erro de formulário nos campos de CRECI; 409 de corretor inativo ao atribuir, como erro do seletor.

## Capabilities

### Modified Capabilities
- `admin-panel`: adiciona a seção de corretores (lista, criar/editar, desativar/reativar) e o seletor de corretor nas telas de imóvel e de lead.
- `mobile-access`: estende a regra de área de toque de 44px para a nova aba "Corretores" e para as ações de desativar/reativar da lista de corretores.

## Impact

- Novas rotas no front: `/admin/corretores`.
- Novos hooks TanStack Query sobre `/corretores` (listar, criar, editar, desativar, reativar) e sobre as atribuições (`/corretores/{id}/imoveis/{imovelId}`, `/corretores/{id}/leads/{leadId}`).
- `src/app/admin/layout.tsx`: nova aba de navegação.
- `src/app/admin/imoveis/[imovelId]/page.tsx` e `src/app/admin/leads/_components/LeadRow.tsx`: acrescentam o seletor de corretor.
- Nenhuma mudança de contrato com a API: os endpoints já estão em produção.
