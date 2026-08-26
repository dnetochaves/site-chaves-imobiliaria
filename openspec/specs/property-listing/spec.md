# property-listing Specification

## Purpose

Fornece um componente de card de imóvel reutilizável e a busca de uma lista de imóveis via API, para que qualquer página que precise exibir imóveis (Home hoje, Busca no futuro) use o mesmo comportamento e os mesmos estados de carregamento/erro.

## Requirements

### Requirement: Card de imóvel exibe dados essenciais
O sistema SHALL exibir, para cada imóvel em uma listagem, ao menos: uma imagem (foto real quando disponível nos dados recebidos, placeholder caso contrário), localização (bairro/cidade), preço, metragem, número de quartos e um indicador do tipo de operação (aluguel ou compra).

#### Scenario: Imóvel com dados de localização/preço/metragem
- **WHEN** um imóvel retornado pela API tem localização, preço, metragem e quartos preenchidos
- **THEN** o card exibe todos esses dados formatados (preço em Real, metragem em m²)

#### Scenario: Listagem sem foto disponível nos dados recebidos
- **WHEN** o endpoint usado para popular a listagem não inclui foto do imóvel (caso atual do endpoint de busca da API, que retorna apenas o resumo do imóvel)
- **THEN** o card exibe uma imagem de placeholder no lugar da foto, sem quebrar o layout

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
