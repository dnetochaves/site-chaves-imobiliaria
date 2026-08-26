# site-shell Specification

## Purpose

Garante que toda página pública do site tenha um header de navegação e um footer institucional consistentes, para que o usuário sempre tenha acesso à navegação principal e às informações de identificação da empresa, independente de qual página está vendo.

## Requirements

### Requirement: Header presente em toda página
Toda página pública do site SHALL exibir um header no topo contendo a logo da marca, os links de navegação principal (Alugar, Comprar, Anunciar, Ajuda) e as ações de conta (Entrar, Criar conta).

#### Scenario: Header visível na Home
- **WHEN** um usuário acessa a rota `/`
- **THEN** o header aparece no topo com a logo, os 4 links de navegação e as ações "Entrar"/"Criar conta"

#### Scenario: Header consistente entre páginas
- **WHEN** um usuário navega de uma página pública para outra do site
- **THEN** o mesmo header (mesma logo, mesmos links) continua presente no topo

### Requirement: Links de navegação do header são elementos clicáveis
Cada item de navegação do header (Alugar, Comprar, Anunciar, Ajuda, Entrar, Criar conta) SHALL ser um elemento clicável (link) com um destino de URL definido.

#### Scenario: Clicar em um link de navegação
- **WHEN** um usuário clica em um dos links do header
- **THEN** o navegador tenta navegar para a URL associada àquele link

### Requirement: Footer presente em toda página
Toda página pública do site SHALL exibir um footer contendo a logo da marca, a identificação da empresa (CRECI e CNPJ) e links organizados em colunas temáticas (Buscar, Proprietários, Chaves).

#### Scenario: Footer visível na Home
- **WHEN** um usuário acessa a rota `/` e rola até o final da página
- **THEN** o footer aparece com a logo, a identificação da empresa e as 3 colunas de links

#### Scenario: Links do footer são clicáveis
- **WHEN** um usuário clica em um link de qualquer coluna do footer
- **THEN** o navegador tenta navegar para a URL associada àquele link
