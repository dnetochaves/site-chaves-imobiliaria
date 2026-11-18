# search-page Specification

## Purpose

Define o comportamento observável da tela de Busca (`/busca`) — onde o usuário refina critérios de imóvel, vê os resultados em lista paginada e no mapa, e navega a partir dos filtros já indicados pela Home.

## Requirements

### Requirement: Filtros de busca refinam os resultados
A tela de Busca SHALL exibir um campo de busca por texto (que refina por título, descrição, bairro, cidade e nome do condomínio — a rua não faz parte da busca), filtros de operação (aluguel/compra), faixa de preço e número de quartos, além de um controle para expor filtros adicionais (mobiliado, aceita pets, tipo de imóvel, cidade, quartos mínimo, vagas mínimo, área mínima). Alterar qualquer filtro SHALL atualizar a lista de resultados exibida.

#### Scenario: Alterar um filtro atualiza os resultados
- **WHEN** um usuário altera o filtro de quartos (ex.: de "qualquer" para "2 quartos")
- **THEN** a lista de resultados é atualizada para exibir apenas imóveis que atendem ao novo critério

#### Scenario: Remover um filtro ativo
- **WHEN** um usuário remove um filtro ativo (ex.: clicando no "×" do chip de faixa de preço)
- **THEN** a lista de resultados é atualizada sem aquele critério

#### Scenario: Buscar por texto livre
- **WHEN** um usuário digita um termo no campo de busca principal (ex.: uma característica do imóvel, não só um nome de bairro)
- **THEN** a lista de resultados exibe imóveis cujo título, descrição, bairro, cidade ou nome do condomínio contenha o termo buscado

#### Scenario: Refinar por tipo, cidade, quartos mínimo, vagas mínimo ou área mínima
- **WHEN** um usuário define um dos filtros adicionais (tipo de imóvel, cidade, quartos mínimo, vagas mínimo, área mínima) no painel de mais filtros
- **THEN** a lista de resultados é atualizada para exibir apenas imóveis que atendem a esse critério, combinado com os demais filtros ativos

#### Scenario: Texto de ajuda do campo de busca
- **WHEN** a tela de Busca (ou a busca da Home) exibe o campo de texto
- **THEN** o texto de ajuda do campo cita bairro, cidade ou condomínio e não menciona rua

### Requirement: Filtros iniciais vêm da URL
A tela de Busca SHALL ler os parâmetros de busca presentes na URL ao carregar a página (ex.: `local`, `operacao`, `bairro`, `quartos`, `aceita_pets`) e usá-los como filtros iniciais, refletidos tanto na UI dos filtros quanto na busca disparada.

#### Scenario: Chegar via link com filtro pré-definido
- **WHEN** um usuário chega em `/busca` a partir de um link com parâmetros de filtro na URL (ex.: `/busca?aceita_pets=true`)
- **THEN** a tela já carrega com esse filtro ativo, tanto na UI quanto nos resultados exibidos

### Requirement: Resultados exibem contagem total e paginação
A tela de Busca SHALL exibir a contagem total de imóveis encontrados para os critérios atuais, e SHALL permitir navegar entre páginas de resultados quando o total exceder o tamanho de uma página.

#### Scenario: Contagem exibida
- **WHEN** a busca retorna resultados
- **THEN** a tela exibe o número total de imóveis encontrados

#### Scenario: Navegar para outra página de resultados
- **WHEN** um usuário clica em outra página na paginação
- **THEN** a lista de resultados é atualizada para exibir os imóveis daquela página, sem recarregar a tela inteira

### Requirement: Resultados podem ser ordenados
A tela de Busca SHALL prover uma forma de ordenar os resultados (ex.: por menor preço).

#### Scenario: Trocar a ordenação
- **WHEN** um usuário seleciona um critério de ordenação diferente
- **THEN** a lista de resultados é reordenada de acordo com o critério escolhido
