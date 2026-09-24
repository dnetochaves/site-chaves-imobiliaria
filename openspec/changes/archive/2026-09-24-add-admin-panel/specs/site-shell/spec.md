## ADDED Requirements

### Requirement: Header oferece acesso ao painel administrativo somente para staff
Quando o usuário autenticado tem permissão de staff, o header SHALL exibir um link visível para o painel administrativo. Para qualquer outro usuário (autenticado sem permissão de staff ou não autenticado), o header SHALL NOT exibir nenhum link ou indicação do painel.

#### Scenario: Link do painel visível para staff
- **WHEN** um usuário autenticado com permissão de staff acessa qualquer página pública
- **THEN** o header exibe um link para `/admin`

#### Scenario: Link do painel ausente para usuário autenticado sem permissão de staff
- **WHEN** um usuário autenticado sem permissão de staff acessa qualquer página pública
- **THEN** o header não exibe nenhum link para `/admin`

#### Scenario: Link do painel ausente para usuário não autenticado
- **WHEN** um usuário não autenticado acessa qualquer página pública
- **THEN** o header não exibe nenhum link para `/admin`
