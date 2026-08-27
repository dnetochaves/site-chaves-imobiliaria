## MODIFIED Requirements

### Requirement: Home exibe imóveis selecionados
A Home SHALL exibir uma seção com uma lista de imóveis que têm visita disponível nas próximas 48 horas, incluindo um subtexto explicativo e um link para a listagem completa. Cada imóvel exibido SHALL indicar quando a próxima visita está disponível.

#### Scenario: Carregar a Home
- **WHEN** um usuário acessa a rota `/`
- **THEN** a seção "Selecionados para hoje" (ou equivalente) exibe os imóveis com visita disponível nas próximas 48 horas, vindos da API, respeitando os estados de carregamento/erro/vazio da listagem

#### Scenario: Link para ver todos os imóveis
- **WHEN** um usuário acessa a Home
- **THEN** a seção de imóveis em destaque exibe um link "Ver todos" que navega para a rota `/busca`

#### Scenario: Card exibe a próxima visita disponível
- **WHEN** um imóvel é exibido na seção "Selecionados para hoje"
- **THEN** o card indica quando a próxima visita está disponível, usando o dado real retornado pela API

#### Scenario: Nenhum imóvel com visita disponível
- **WHEN** a API não retorna nenhum imóvel com visita disponível nas próximas 48 horas
- **THEN** a seção exibe uma mensagem informando que não há imóveis com visita disponível no momento, em vez de uma área em branco ou da seção inteira desaparecer
