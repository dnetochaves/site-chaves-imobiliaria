## MODIFIED Requirements

### Requirement: Header presente em toda página
Toda página pública do site SHALL exibir um header no topo contendo a logo da marca, os links de navegação principal (Alugar, Comprar, Anunciar, Ajuda) e uma ação de conta que reflete o estado de autenticação: um CTA de login quando o usuário não está autenticado, ou o nome do usuário e uma ação de sair quando está autenticado.

#### Scenario: Header visível na Home
- **WHEN** um usuário não autenticado acessa a rota `/`
- **THEN** o header aparece no topo com a logo, os 4 links de navegação e um CTA de login

#### Scenario: Header consistente entre páginas
- **WHEN** um usuário navega de uma página pública para outra do site
- **THEN** o mesmo header (mesma logo, mesmos links) continua presente no topo

#### Scenario: Header reflete usuário autenticado
- **WHEN** um usuário autenticado acessa qualquer página pública
- **THEN** o header exibe o nome do usuário e uma ação para sair, em vez do CTA de login

### Requirement: Links de navegação do header são elementos clicáveis
Cada item de navegação do header (Alugar, Comprar, Anunciar, Ajuda) SHALL ser um elemento clicável (link) com um destino de URL definido. A ação de conta (login ou sair) SHALL ser clicável e disparar o fluxo correspondente.

#### Scenario: Clicar em um link de navegação
- **WHEN** um usuário clica em um dos links do header
- **THEN** o navegador tenta navegar para a URL associada àquele link

#### Scenario: Clicar no CTA de login
- **WHEN** um usuário não autenticado clica no CTA de login do header
- **THEN** o navegador é redirecionado para o fluxo de login OAuth

#### Scenario: Clicar em sair
- **WHEN** um usuário autenticado clica na ação de sair
- **THEN** a sessão é encerrada e o header volta a exibir o CTA de login
