## ADDED Requirements

### Requirement: Header oferece menu de navegação em telas pequenas
Em telas estreitas, o header SHALL oferecer um botão de menu que dá acesso a todos os links de navegação principal (Alugar, Comprar, Anunciar, Ajuda) e, conforme o usuário, a Favoritos (somente autenticado) e ao painel administrativo (somente staff). O botão SHALL ter um rótulo acessível que indique a ação (abrir ou fechar o menu) e SHALL informar se o menu está aberto. A ação de conta (entrar ou sair) SHALL continuar visível no header mesmo com o menu fechado.

#### Scenario: Abrir o menu no celular
- **WHEN** um usuário, em tela estreita, aciona o botão de menu do header
- **THEN** o header exibe a lista de links de navegação principal e o botão passa a indicar que o menu está aberto

#### Scenario: Fechar o menu
- **WHEN** o menu está aberto e o usuário aciona o botão de menu novamente ou pressiona a tecla Esc
- **THEN** o menu é fechado

#### Scenario: Fechar o menu ao navegar
- **WHEN** o menu está aberto e o usuário aciona um dos links
- **THEN** o navegador vai para a página do link e o menu fica fechado

#### Scenario: Menu para usuário não autenticado
- **WHEN** um usuário não autenticado abre o menu em tela estreita
- **THEN** o menu exibe Alugar, Comprar, Anunciar e Ajuda, sem Favoritos e sem Admin

#### Scenario: Menu para usuário autenticado sem permissão de staff
- **WHEN** um usuário autenticado sem permissão de staff abre o menu em tela estreita
- **THEN** o menu exibe os links principais e Favoritos, sem Admin

#### Scenario: Menu para usuário staff
- **WHEN** um usuário autenticado com permissão de staff abre o menu em tela estreita
- **THEN** o menu exibe os links principais, Favoritos e Admin

#### Scenario: Tela larga não exibe o botão de menu
- **WHEN** um usuário acessa o site em tela larga (desktop)
- **THEN** o header exibe os links de navegação diretamente, sem o botão de menu
