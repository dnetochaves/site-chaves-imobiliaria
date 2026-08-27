## ADDED Requirements

### Requirement: Card de imóvel em formato de lista horizontal
O sistema SHALL prover um formato de card de imóvel em layout horizontal compacto (thumbnail pequena à esquerda, dados à direita), exibindo os mesmos dados essenciais do card em grade (localização, título, preço, metragem, quartos, tipo de operação), como uma alternativa reutilizável para páginas que exibem imóveis em lista (ex.: resultados de busca).

#### Scenario: Card de lista exibe dados essenciais
- **WHEN** um imóvel é exibido no formato de card de lista horizontal
- **THEN** o card exibe localização, título, preço, metragem, quartos e tipo de operação, no layout horizontal (thumbnail à esquerda, dados à direita)
