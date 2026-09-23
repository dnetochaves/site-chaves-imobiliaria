## MODIFIED Requirements

### Requirement: Página de detalhe exibe os dados completos do imóvel
O sistema SHALL exibir, para um imóvel identificado por ID na URL, uma galeria de fotos, título, endereço completo, especificações (área útil, quartos, banheiros, vagas de garagem), descrição, lista de características (amenidades), o detalhamento do preço mensal (aluguel, condomínio, IPTU, seguro incêndio e total) e o tipo do imóvel (ex.: apartamento, casa, studio) quando esse dado estiver preenchido.

#### Scenario: Imóvel com todos os dados preenchidos
- **WHEN** a página de detalhe carrega um imóvel que tem fotos, descrição, amenidades e todos os valores de preço preenchidos
- **THEN** a página exibe a galeria, a descrição, a lista de características e o detalhamento completo do preço

#### Scenario: Item de preço ausente no detalhamento
- **WHEN** o imóvel carregado não tem um dos valores de preço preenchido (ex.: sem seguro incêndio)
- **THEN** a página omite essa linha do detalhamento, sem exibir um valor vazio ou zerado

#### Scenario: Imóvel com tipo definido
- **WHEN** o imóvel carregado tem o tipo definido
- **THEN** a página exibe o tipo do imóvel

#### Scenario: Imóvel sem tipo definido
- **WHEN** o imóvel carregado não tem o tipo definido (campo nulo)
- **THEN** a página não exibe nenhum indicador de tipo, sem mostrar um valor vazio ou um texto genérico no lugar
