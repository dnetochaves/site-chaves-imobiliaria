## Purpose

Define o comportamento observável da página Home pública do site — a porta de entrada para busca de imóveis, destaque de imóveis selecionados e os principais CTAs institucionais (condomínios, cadastro de imóvel).

## ADDED Requirements

### Requirement: Home exibe imóveis selecionados
A Home SHALL exibir uma seção com uma lista de imóveis em destaque, usando a capability de listagem de imóveis.

#### Scenario: Carregar a Home
- **WHEN** um usuário acessa a rota `/`
- **THEN** a seção "Selecionados para hoje" (ou equivalente) exibe uma listagem de imóveis vinda da API, respeitando os estados de carregamento/erro/vazio da listagem

### Requirement: Busca a partir da Home navega para a tela de Busca
A Home SHALL prover um formulário de busca (local e tipo de operação) que, ao ser submetido, navega o usuário para a rota `/busca` com os critérios preenchidos como parâmetros de URL.

#### Scenario: Submissão da busca
- **WHEN** um usuário preenche o campo de local e/ou o tipo de operação e submete a busca
- **THEN** o navegador é levado para `/busca` com os valores preenchidos representados na query string

#### Scenario: Submissão sem preencher nenhum campo
- **WHEN** um usuário submete a busca sem preencher nenhum campo
- **THEN** o sistema não bloqueia a submissão nem exige preenchimento obrigatório, e navega para `/busca` sem parâmetros

### Requirement: Atalhos de categoria navegam para a busca pré-filtrada
A Home SHALL exibir atalhos de categoria (ex.: bairro específico, tipo de imóvel) que, ao serem clicados, navegam para `/busca` já com o filtro correspondente preenchido na URL.

#### Scenario: Clicar em um atalho de categoria
- **WHEN** um usuário clica em um atalho de categoria (ex.: um bairro específico)
- **THEN** o navegador é levado para `/busca` com o parâmetro de filtro correspondente já preenchido

### Requirement: CTAs institucionais são links visíveis
A Home SHALL exibir um CTA para o serviço de gestão de condomínios e um CTA para cadastro de imóvel para aluguel, cada um como um elemento clicável identificável.

#### Scenario: CTA de condomínios visível
- **WHEN** um usuário acessa a Home
- **THEN** o CTA "Administramos o seu condomínio" está visível e é um elemento clicável (link ou botão)

#### Scenario: CTA de cadastro de imóvel visível
- **WHEN** um usuário acessa a Home
- **THEN** o CTA "Tem um imóvel para alugar?" está visível e é um elemento clicável (link ou botão)
