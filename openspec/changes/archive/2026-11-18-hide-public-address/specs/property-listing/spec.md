## MODIFIED Requirements

### Requirement: Card de imóvel exibe dados essenciais
O sistema SHALL exibir, para cada imóvel em uma listagem, ao menos: uma imagem (foto real quando disponível nos dados recebidos; senão, um placeholder genérico), localização (bairro/cidade), preço, metragem, número de quartos, um indicador do tipo de operação (aluguel ou compra) e um indicador do tipo do imóvel (ex.: apartamento, casa, studio) quando esse dado estiver preenchido. O card SHALL NOT exibir rua, número nem mapa do imóvel.

#### Scenario: Imóvel com dados de localização/preço/metragem
- **WHEN** um imóvel retornado pela API tem localização, preço, metragem e quartos preenchidos
- **THEN** o card exibe todos esses dados formatados (preço em Real, metragem em m²)

#### Scenario: Listagem sem foto disponível nos dados recebidos
- **WHEN** o imóvel retornado pela API não tem foto (campo de foto de capa nulo)
- **THEN** o card exibe uma imagem de placeholder genérica no lugar da foto, sem pré-visualização de mapa e sem quebrar o layout

#### Scenario: Imóvel sem foto e sem coordenadas de localização
- **WHEN** o imóvel retornado pela API não tem foto e a localização pública traz apenas bairro e cidade (sem coordenadas)
- **THEN** o card exibe uma imagem de placeholder genérica no lugar da foto, sem quebrar o layout

#### Scenario: Imóvel com tipo definido exibe o tipo
- **WHEN** um imóvel retornado pela API tem o tipo definido (ex.: apartamento)
- **THEN** o card exibe um indicador com o tipo do imóvel

#### Scenario: Imóvel sem tipo definido não exibe indicador de tipo
- **WHEN** um imóvel retornado pela API não tem o tipo definido (campo nulo)
- **THEN** o card não exibe nenhum indicador de tipo, sem mostrar um valor vazio ou um texto genérico no lugar

### Requirement: Card de imóvel em formato de lista horizontal
O sistema SHALL prover um formato de card de imóvel em layout horizontal compacto (thumbnail pequena à esquerda, dados à direita), exibindo os mesmos dados essenciais do card em grade (localização, título, preço, metragem, quartos, tipo de operação e tipo do imóvel quando informado), como uma alternativa reutilizável para páginas que exibem imóveis em lista (ex.: resultados de busca). O thumbnail SHALL seguir a mesma prioridade de imagem definida no requisito "Card de imóvel exibe dados essenciais" (foto real; senão, placeholder genérico).

#### Scenario: Card de lista exibe dados essenciais
- **WHEN** um imóvel é exibido no formato de card de lista horizontal
- **THEN** o card exibe localização, título, preço, metragem, quartos e tipo de operação, no layout horizontal (thumbnail à esquerda, dados à direita)

#### Scenario: Thumbnail do card de lista segue a mesma prioridade de imagem do card em grade
- **WHEN** um imóvel é exibido no formato de card de lista horizontal e não tem foto real disponível nos dados recebidos
- **THEN** o thumbnail exibe o mesmo placeholder genérico usado no card em grade, sem pré-visualização de mapa

#### Scenario: Card de lista exibe o tipo do imóvel quando informado
- **WHEN** um imóvel exibido no formato de card de lista horizontal tem o tipo definido
- **THEN** o card exibe um indicador com o tipo do imóvel, seguindo o mesmo comportamento do card em grade (incluindo a ausência do indicador quando o tipo não está definido)
