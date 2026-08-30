## MODIFIED Requirements

### Requirement: Hero da Home exibe elementos de credibilidade
O Hero da Home SHALL exibir, sobre a foto ilustrativa, um selo com uma estatística de chaves entregues e um card explicando o acompanhamento por um corretor durante o processo, como elementos de credibilidade complementares à busca.

#### Scenario: Selo de estatística visível
- **WHEN** um usuário acessa a Home
- **THEN** o Hero exibe um selo com a estatística de chaves entregues, sem exigir um rótulo de período (ex.: mês) associado ao número

#### Scenario: Card de acompanhamento por corretor visível
- **WHEN** um usuário acessa a Home
- **THEN** o Hero exibe um card explicando que um corretor acompanha o processo do primeiro clique até a entrega das chaves
