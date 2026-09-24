## Why

A API já tem ações exclusivas da equipe (aprovar, pausar e rejeitar anúncios de imóveis), mas o site não tem nenhuma interface para elas — hoje só dá pra usar chamando a API direto. A equipe precisa de um painel administrativo dentro do site, visível apenas para usuários marcados como staff (`is_staff=true`).

## What Changes

- Nova área `/admin`, acessível somente a usuários autenticados com `is_staff=true`.
- Quem não é staff não vê o link do painel no header e, ao acessar `/admin` diretamente, vê "Página não encontrada" (o painel não revela que existe). Usuário não autenticado é levado ao login.
- Primeira funcionalidade do painel — moderação de imóveis:
  - Lista dos imóveis publicados, com ação de pausar.
  - Campo "abrir imóvel por ID" que leva a uma tela com o imóvel, seu status atual e as ações de aprovar, pausar e rejeitar; se a API recusar a ação (ex.: transição de status inválida), a tela mostra uma mensagem de erro em português e mantém o status.
- Header ganha um link "Admin", exibido só para staff.
- Limitação conhecida: a API ainda não oferece listagem de imóveis pendentes (`em_analise`), então não há fila de pendentes — só busca por ID e lista de publicados.

## Capabilities

### New Capabilities

- `admin-panel`: acesso restrito a staff e moderação de imóveis (listar publicados, abrir por ID, aprovar/pausar/rejeitar).

### Modified Capabilities

- `site-shell`: o header passa a exibir um link para o painel administrativo apenas quando o usuário autenticado é staff.

## Impact

- Novas rotas em `src/app/admin/` (layout com guard, home do painel, tela de imóvel por ID).
- Novos hooks de API para aprovar/pausar/rejeitar imóvel; reaproveita `useImovelDetail` e `useImoveis`.
- `src/components/shell/Header.tsx` (link condicional).
- O guard no front é só experiência de uso; a segurança real continua sendo o 403 da API para não-staff.
- Fora de escopo: leads, visitas, condomínios, fila de pendentes, mudanças no backend, promover usuários a staff.
