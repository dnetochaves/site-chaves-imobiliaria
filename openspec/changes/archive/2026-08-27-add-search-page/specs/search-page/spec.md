## Purpose

Define o comportamento observável da tela de Busca (`/busca`) — onde o usuário refina critérios de imóvel, vê os resultados em lista paginada e no mapa, e navega a partir dos filtros já indicados pela Home.

## ADDED Requirements

### Requirement: Filtros de busca refinam os resultados
A tela de Busca SHALL exibir um campo de local, filtros de operação (aluguel/compra), faixa de preço e número de quartos, além de um controle para expor filtros adicionais (mobiliado, aceita pets). Alterar qualquer filtro SHALL atualizar a lista de resultados exibida.

#### Scenario: Alterar um filtro atualiza os resultados
- **WHEN** um usuário altera o filtro de quartos (ex.: de "qualquer" para "2 quartos")
- **THEN** a lista de resultados é atualizada para exibir apenas imóveis que atendem ao novo critério

#### Scenario: Remover um filtro ativo
- **WHEN** um usuário remove um filtro ativo (ex.: clicando no "×" do chip de faixa de preço)
- **THEN** a lista de resultados é atualizada sem aquele critério

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

### Requirement: Mapa exibe os imóveis com preço e sincroniza com a lista
A tela de Busca SHALL exibir um mapa com um marcador por imóvel resultante da busca, mostrando o preço em cada marcador. Passar o cursor sobre um card da lista SHALL destacar visualmente o marcador correspondente no mapa.

#### Scenario: Marcadores exibem preço
- **WHEN** a busca retorna imóveis com coordenadas válidas
- **THEN** o mapa exibe um marcador por imóvel, cada um mostrando o preço correspondente

#### Scenario: Hover na lista destaca o mapa
- **WHEN** um usuário passa o cursor sobre um card de imóvel na lista
- **THEN** o marcador correspondente a esse imóvel é destacado visualmente no mapa
