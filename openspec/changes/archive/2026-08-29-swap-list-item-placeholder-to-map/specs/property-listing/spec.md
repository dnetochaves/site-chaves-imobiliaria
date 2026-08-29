## MODIFIED Requirements

### Requirement: Card de imóvel em formato de lista horizontal
O sistema SHALL prover um formato de card de imóvel em layout horizontal compacto (thumbnail pequena à esquerda, dados à direita), exibindo os mesmos dados essenciais do card em grade (localização, título, preço, metragem, quartos, tipo de operação), como uma alternativa reutilizável para páginas que exibem imóveis em lista (ex.: resultados de busca). O thumbnail SHALL seguir a mesma prioridade de imagem definida no requisito "Card de imóvel exibe dados essenciais" (foto real; senão, pré-visualização de mapa quando houver latitude/longitude válidos; senão, placeholder genérico).

#### Scenario: Card de lista exibe dados essenciais
- **WHEN** um imóvel é exibido no formato de card de lista horizontal
- **THEN** o card exibe localização, título, preço, metragem, quartos e tipo de operação, no layout horizontal (thumbnail à esquerda, dados à direita)

#### Scenario: Thumbnail do card de lista segue a mesma prioridade de imagem do card em grade
- **WHEN** um imóvel é exibido no formato de card de lista horizontal e tem latitude/longitude válidos, mas não tem foto real disponível nos dados recebidos
- **THEN** o thumbnail exibe a mesma pré-visualização de mapa não-interativa usada no card em grade, centralizada na localização do imóvel
