## MODIFIED Requirements

### Requirement: Card de imóvel exibe dados essenciais
O sistema SHALL exibir, para cada imóvel em uma listagem, ao menos: uma imagem (foto real quando disponível nos dados recebidos; senão, uma pré-visualização de mapa com a localização do imóvel, quando houver latitude/longitude válidos; senão, um placeholder genérico), localização (bairro/cidade), preço, metragem, número de quartos, um indicador do tipo de operação (aluguel ou compra) e um indicador do tipo do imóvel (ex.: apartamento, casa, studio) quando esse dado estiver preenchido.

#### Scenario: Imóvel com dados de localização/preço/metragem
- **WHEN** um imóvel retornado pela API tem localização, preço, metragem e quartos preenchidos
- **THEN** o card exibe todos esses dados formatados (preço em Real, metragem em m²)

#### Scenario: Listagem sem foto disponível nos dados recebidos
- **WHEN** o imóvel retornado pela API não tem foto (campo de foto de capa nulo) e tem latitude/longitude válidos
- **THEN** o card exibe, no lugar da foto, uma pré-visualização de mapa não-interativa (sem pan/zoom/drag) centralizada na localização do imóvel, com um marcador indicando o ponto, sem quebrar o layout

#### Scenario: Imóvel sem foto e sem coordenadas de localização
- **WHEN** o imóvel retornado pela API não tem foto e também não tem latitude/longitude válidos
- **THEN** o card exibe uma imagem de placeholder genérica no lugar da foto/mapa, sem quebrar o layout

#### Scenario: Imóvel com tipo definido exibe o tipo
- **WHEN** um imóvel retornado pela API tem o tipo definido (ex.: apartamento)
- **THEN** o card exibe um indicador com o tipo do imóvel

#### Scenario: Imóvel sem tipo definido não exibe indicador de tipo
- **WHEN** um imóvel retornado pela API não tem o tipo definido (campo nulo)
- **THEN** o card não exibe nenhum indicador de tipo, sem mostrar um valor vazio ou um texto genérico no lugar

### Requirement: Card de imóvel em formato de lista horizontal
O sistema SHALL prover um formato de card de imóvel em layout horizontal compacto (thumbnail pequena à esquerda, dados à direita), exibindo os mesmos dados essenciais do card em grade (localização, título, preço, metragem, quartos, tipo de operação e tipo do imóvel quando informado), como uma alternativa reutilizável para páginas que exibem imóveis em lista (ex.: resultados de busca). O thumbnail SHALL seguir a mesma prioridade de imagem definida no requisito "Card de imóvel exibe dados essenciais" (foto real; senão, pré-visualização de mapa quando houver latitude/longitude válidos; senão, placeholder genérico).

#### Scenario: Card de lista exibe dados essenciais
- **WHEN** um imóvel é exibido no formato de card de lista horizontal
- **THEN** o card exibe localização, título, preço, metragem, quartos e tipo de operação, no layout horizontal (thumbnail à esquerda, dados à direita)

#### Scenario: Thumbnail do card de lista segue a mesma prioridade de imagem do card em grade
- **WHEN** um imóvel é exibido no formato de card de lista horizontal e tem latitude/longitude válidos, mas não tem foto real disponível nos dados recebidos
- **THEN** o thumbnail exibe a mesma pré-visualização de mapa não-interativa usada no card em grade, centralizada na localização do imóvel

#### Scenario: Card de lista exibe o tipo do imóvel quando informado
- **WHEN** um imóvel exibido no formato de card de lista horizontal tem o tipo definido
- **THEN** o card exibe um indicador com o tipo do imóvel, seguindo o mesmo comportamento do card em grade (incluindo a ausência do indicador quando o tipo não está definido)
