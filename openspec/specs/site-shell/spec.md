# site-shell Specification

## Purpose

Garante que toda página pública do site tenha um header de navegação e um footer institucional consistentes, para que o usuário sempre tenha acesso à navegação principal e às informações de identificação da empresa, independente de qual página está vendo.

## Requirements

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

### Requirement: Footer presente em toda página
Toda página pública do site SHALL exibir um footer contendo a logo da marca, a identificação da empresa (CRECI e CNPJ) e links organizados em colunas temáticas (Buscar, Proprietários, Chaves).

#### Scenario: Footer visível na Home
- **WHEN** um usuário acessa a rota `/` e rola até o final da página
- **THEN** o footer aparece com a logo, a identificação da empresa e as 3 colunas de links

#### Scenario: Links do footer são clicáveis
- **WHEN** um usuário clica em um link de qualquer coluna do footer
- **THEN** o navegador tenta navegar para a URL associada àquele link

### Requirement: Header oferece acesso aos favoritos quando autenticado
Quando o usuário está autenticado, o header SHALL exibir um link visível para a página de favoritos.

#### Scenario: Link de favoritos visível pra usuário autenticado
- **WHEN** um usuário autenticado acessa qualquer página pública
- **THEN** o header exibe um link para `/favoritos`

#### Scenario: Link de favoritos ausente pra usuário não autenticado
- **WHEN** um usuário não autenticado acessa qualquer página pública
- **THEN** o header não exibe nenhum link para `/favoritos`

### Requirement: Favicon reflete a marca oficial
O site SHALL usar o favicon oficial da marca Chaves Imobiliária (não um ícone genérico ou placeholder de scaffold) na aba do navegador.

#### Scenario: Favicon visível na aba do navegador
- **WHEN** um usuário acessa qualquer página pública do site
- **THEN** a aba do navegador exibe o favicon oficial da marca
