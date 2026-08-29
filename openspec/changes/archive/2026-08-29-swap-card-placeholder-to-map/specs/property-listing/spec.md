## MODIFIED Requirements

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
