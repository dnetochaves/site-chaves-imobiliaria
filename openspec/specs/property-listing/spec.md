# property-listing Specification

## Purpose

Fornece um componente de card de imóvel reutilizável e a busca de uma lista de imóveis via API, para que qualquer página que precise exibir imóveis (Home hoje, Busca no futuro) use o mesmo comportamento e os mesmos estados de carregamento/erro.

## Requirements

### Requirement: Card de imóvel exibe dados essenciais
O sistema SHALL exibir, para cada imóvel em uma listagem, ao menos: uma imagem (foto real quando disponível nos dados recebidos; senão, uma pré-visualização de mapa com a localização do imóvel, quando houver latitude/longitude válidos; senão, um placeholder genérico), localização (bairro/cidade), preço, metragem, número de quartos e um indicador do tipo de operação (aluguel ou compra).

#### Scenario: Imóvel com dados de localização/preço/metragem
- **WHEN** um imóvel retornado pela API tem localização, preço, metragem e quartos preenchidos
- **THEN** o card exibe todos esses dados formatados (preço em Real, metragem em m²)

#### Scenario: Listagem sem foto disponível nos dados recebidos
- **WHEN** o endpoint usado para popular a listagem não inclui foto do imóvel (caso atual do endpoint de busca da API, que retorna apenas o resumo do imóvel) e o imóvel tem latitude/longitude válidos
- **THEN** o card exibe, no lugar da foto, uma pré-visualização de mapa não-interativa (sem pan/zoom/drag) centralizada na localização do imóvel, com um marcador indicando o ponto, sem quebrar o layout

#### Scenario: Imóvel sem foto e sem coordenadas de localização
- **WHEN** o endpoint usado para popular a listagem não inclui foto do imóvel e o imóvel também não tem latitude/longitude válidos
- **THEN** o card exibe uma imagem de placeholder genérica no lugar da foto/mapa, sem quebrar o layout

### Requirement: Listagem de imóveis busca dados reais da API
O sistema SHALL buscar uma lista de imóveis a partir do endpoint de catálogo de imóveis da API, aceitando um limite de itens configurável.

#### Scenario: Busca bem-sucedida
- **WHEN** uma página solicita uma listagem de imóveis com um limite de N itens
- **THEN** o sistema exibe até N cards de imóvel com os dados retornados pela API

### Requirement: Estados de carregamento, erro e lista vazia na listagem
Toda listagem de imóveis SHALL exibir um estado visual distinto para carregamento, para erro na busca e para quando a API retorna zero imóveis.

#### Scenario: Carregando
- **WHEN** a busca de imóveis está em andamento
- **THEN** a listagem exibe um indicador de carregamento no lugar dos cards

#### Scenario: Erro na busca
- **WHEN** a busca de imóveis falha (erro de rede ou resposta de erro da API)
- **THEN** a listagem exibe uma mensagem de erro, sem quebrar o restante da página

#### Scenario: Lista vazia
- **WHEN** a API retorna uma lista vazia de imóveis para os critérios buscados
- **THEN** a listagem exibe uma mensagem informando que não há imóveis, em vez de uma área em branco

### Requirement: Card de imóvel em formato de lista horizontal
O sistema SHALL prover um formato de card de imóvel em layout horizontal compacto (thumbnail pequena à esquerda, dados à direita), exibindo os mesmos dados essenciais do card em grade (localização, título, preço, metragem, quartos, tipo de operação), como uma alternativa reutilizável para páginas que exibem imóveis em lista (ex.: resultados de busca). O thumbnail SHALL seguir a mesma prioridade de imagem definida no requisito "Card de imóvel exibe dados essenciais" (foto real; senão, pré-visualização de mapa quando houver latitude/longitude válidos; senão, placeholder genérico).

#### Scenario: Card de lista exibe dados essenciais
- **WHEN** um imóvel é exibido no formato de card de lista horizontal
- **THEN** o card exibe localização, título, preço, metragem, quartos e tipo de operação, no layout horizontal (thumbnail à esquerda, dados à direita)

#### Scenario: Thumbnail do card de lista segue a mesma prioridade de imagem do card em grade
- **WHEN** um imóvel é exibido no formato de card de lista horizontal e tem latitude/longitude válidos, mas não tem foto real disponível nos dados recebidos
- **THEN** o thumbnail exibe a mesma pré-visualização de mapa não-interativa usada no card em grade, centralizada na localização do imóvel

### Requirement: Card de imóvel navega para o detalhe do imóvel
Todo card de imóvel (em grade ou em lista) SHALL ser um elemento navegável que leva à página de detalhe do imóvel correspondente.

#### Scenario: Clicar em um card de imóvel
- **WHEN** um usuário clica em um card de imóvel, em qualquer listagem (grade ou lista)
- **THEN** o navegador leva à página de detalhe daquele imóvel
