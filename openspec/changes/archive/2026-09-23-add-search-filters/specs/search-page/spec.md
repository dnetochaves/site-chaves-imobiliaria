## MODIFIED Requirements

### Requirement: Filtros de busca refinam os resultados
A tela de Busca SHALL exibir um campo de busca por texto (que refina por título, descrição, rua, bairro, cidade e nome do condomínio), filtros de operação (aluguel/compra), faixa de preço e número de quartos, além de um controle para expor filtros adicionais (mobiliado, aceita pets, tipo de imóvel, cidade, quartos mínimo, vagas mínimo, área mínima). Alterar qualquer filtro SHALL atualizar a lista de resultados exibida.

#### Scenario: Alterar um filtro atualiza os resultados
- **WHEN** um usuário altera o filtro de quartos (ex.: de "qualquer" para "2 quartos")
- **THEN** a lista de resultados é atualizada para exibir apenas imóveis que atendem ao novo critério

#### Scenario: Remover um filtro ativo
- **WHEN** um usuário remove um filtro ativo (ex.: clicando no "×" do chip de faixa de preço)
- **THEN** a lista de resultados é atualizada sem aquele critério

#### Scenario: Buscar por texto livre
- **WHEN** um usuário digita um termo no campo de busca principal (ex.: uma característica do imóvel, não só um nome de bairro)
- **THEN** a lista de resultados exibe imóveis cujo título, descrição, rua, bairro, cidade ou nome do condomínio contenha o termo buscado

#### Scenario: Refinar por tipo, cidade, quartos mínimo, vagas mínimo ou área mínima
- **WHEN** um usuário define um dos filtros adicionais (tipo de imóvel, cidade, quartos mínimo, vagas mínimo, área mínima) no painel de mais filtros
- **THEN** a lista de resultados é atualizada para exibir apenas imóveis que atendem a esse critério, combinado com os demais filtros ativos
