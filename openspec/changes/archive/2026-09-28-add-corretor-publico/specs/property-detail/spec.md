## ADDED Requirements

### Requirement: Página de detalhe linka para o corretor responsável
Quando o imóvel tiver um corretor atribuído, a página de detalhe SHALL exibir um link para o card público desse corretor (`/corretores/{slug}`). Quando não houver corretor atribuído, a página SHALL NOT exibir esse link.

#### Scenario: Imóvel com corretor atribuído
- **WHEN** a página de detalhe carrega um imóvel que tem um corretor atribuído
- **THEN** a página exibe um link para o card público desse corretor

#### Scenario: Imóvel sem corretor atribuído
- **WHEN** a página de detalhe carrega um imóvel sem corretor atribuído
- **THEN** a página não exibe nenhum link de corretor
