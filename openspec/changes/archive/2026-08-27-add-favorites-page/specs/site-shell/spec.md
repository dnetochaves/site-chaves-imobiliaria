## ADDED Requirements

### Requirement: Header oferece acesso aos favoritos quando autenticado
Quando o usuário está autenticado, o header SHALL exibir um link visível para a página de favoritos.

#### Scenario: Link de favoritos visível pra usuário autenticado
- **WHEN** um usuário autenticado acessa qualquer página pública
- **THEN** o header exibe um link para `/favoritos`

#### Scenario: Link de favoritos ausente pra usuário não autenticado
- **WHEN** um usuário não autenticado acessa qualquer página pública
- **THEN** o header não exibe nenhum link para `/favoritos`
