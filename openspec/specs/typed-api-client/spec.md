# typed-api-client Specification

## Purpose

Garante que a comunicação do frontend com a API do backend Chaves Imobiliária seja tipada e mantida em sincronia com o contrato real da API, reduzindo divergência entre o que o frontend espera e o que o backend realmente retorna.

## Requirements

### Requirement: Tipos derivados do contrato da API
O sistema SHALL derivar os tipos de dados usados para chamadas de API a partir do contrato OpenAPI publicado pelo backend, e não de tipos escritos manualmente.

#### Scenario: Contrato da API muda um campo
- **WHEN** o backend publica um novo contrato OpenAPI com um campo alterado em um schema (ex.: `ImovelDetail`)
- **THEN** a regeneração dos tipos do frontend reflete a mudança sem exigir edição manual das definições de tipo

### Requirement: Regeneração de tipos sob demanda
O sistema SHALL prover um comando único que busca o contrato OpenAPI mais recente do backend e regenera os tipos do client de API.

#### Scenario: Desenvolvedor atualiza os tipos
- **WHEN** um desenvolvedor executa o comando de regeneração de tipos
- **THEN** os arquivos de tipos da camada de API são atualizados a partir do `openapi.json` do backend em produção

### Requirement: Estado de requisições de dados
Toda chamada de leitura de dados da API feita por um componente SHALL expor de forma distinguível os estados de carregamento, sucesso (com os dados) e erro.

#### Scenario: Requisição em andamento
- **WHEN** um componente dispara uma busca de dados na API
- **THEN** o componente pode identificar que a requisição está em andamento antes da resposta chegar

#### Scenario: Requisição falha
- **WHEN** a API retorna um erro (ex.: status 4xx ou 5xx) para uma requisição
- **THEN** o componente recebe um estado de erro distinguível do estado de sucesso, com informação suficiente para exibir feedback ao usuário

### Requirement: Base URL configurável do backend
O client de API SHALL obter a URL base do backend a partir de configuração de ambiente, não de um valor fixo no código, permitindo apontar para ambientes diferentes (produção, local) sem alterar código-fonte.

#### Scenario: Trocar de ambiente de backend
- **WHEN** a variável de ambiente de URL base da API é alterada
- **THEN** as requisições do client passam a ser feitas para a nova URL sem necessidade de alterar o código da aplicação
