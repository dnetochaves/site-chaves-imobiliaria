## REMOVED Requirements

### Requirement: Home exibe imóveis selecionados
**Reason**: O critério de "imóveis com visita disponível nas próximas 48 horas" deixava a seção vazia na maior parte do tempo, e não representava o critério real pretendido (curadoria da administração). Substituído pelo requisito "Home exibe imóveis verificados pela administração".
**Migration**: Nenhuma migração de dado necessária — é uma troca de fonte de dados na Home (`GET /visitas/disponiveis-em-breve` → `GET /imoveis?verificado=true`), sem impacto em outras páginas.

## ADDED Requirements

### Requirement: Home exibe imóveis verificados pela administração
A Home SHALL exibir uma seção com uma lista de imóveis marcados como verificados pela administração, incluindo um subtexto explicativo e um link para a listagem completa.

#### Scenario: Carregar a Home
- **WHEN** um usuário acessa a rota `/`
- **THEN** a seção "Selecionados para hoje" (ou equivalente) exibe os imóveis verificados pela administração, vindos da API, respeitando os estados de carregamento/erro/vazio da listagem

#### Scenario: Link para ver todos os imóveis
- **WHEN** um usuário acessa a Home
- **THEN** a seção de imóveis em destaque exibe um link "Ver todos" que navega para a rota `/busca`

#### Scenario: Nenhum imóvel verificado
- **WHEN** a API não retorna nenhum imóvel verificado
- **THEN** a seção exibe uma mensagem informando que não há imóveis disponíveis no momento, em vez de uma área em branco ou da seção inteira desaparecer
