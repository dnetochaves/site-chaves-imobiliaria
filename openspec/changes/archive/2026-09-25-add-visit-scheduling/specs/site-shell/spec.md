## ADDED Requirements

### Requirement: Header oferece acesso a Minhas visitas quando autenticado
Quando o usuário está autenticado, o header SHALL exibir um link visível para a página "Minhas visitas", também presente no menu de navegação em telas pequenas. Para um usuário não autenticado, o header e o menu SHALL NOT exibir esse link.

#### Scenario: Link visível para usuário autenticado
- **WHEN** um usuário autenticado acessa qualquer página pública
- **THEN** o header exibe um link para `/minhas-visitas`

#### Scenario: Link no menu em tela estreita
- **WHEN** um usuário autenticado abre o menu de navegação em tela estreita
- **THEN** o menu exibe o link para Minhas visitas

#### Scenario: Link ausente para usuário não autenticado
- **WHEN** um usuário não autenticado acessa qualquer página pública
- **THEN** nem o header nem o menu exibem link para `/minhas-visitas`
