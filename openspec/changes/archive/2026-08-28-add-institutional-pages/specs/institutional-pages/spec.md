## Purpose

Dá às rotas "Alugar", "Comprar" e "Sobre" — já referenciadas no Header e no Footer — conteúdo educativo/institucional real, ajudando o usuário a entender o processo antes de buscar ou decidir, e reforçando a proposta de valor da Chaves.

## ADDED Requirements

### Requirement: Página Alugar exibe busca, atalhos e conteúdo educativo
A rota `/alugar` SHALL exibir um formulário de busca dedicado ao aluguel, atalhos de filtro rápido, uma seção de imóveis reais disponíveis para aluguel, e uma seção de conteúdo educativo sobre o processo de alugar.

#### Scenario: Buscar a partir da página Alugar
- **WHEN** um usuário preenche e submete a busca na página `/alugar`
- **THEN** o navegador é levado para `/busca` com o tipo de operação de aluguel já preenchido

#### Scenario: Clicar num atalho de filtro rápido
- **WHEN** um usuário clica num atalho de filtro (ex.: "2 quartos") na página `/alugar`
- **THEN** o navegador é levado para `/busca` com o tipo de operação de aluguel e o filtro correspondente já preenchidos

#### Scenario: Imóveis reais em destaque no Alugar
- **WHEN** um usuário acessa `/alugar`
- **THEN** a página exibe imóveis disponíveis para aluguel vindos da API, respeitando os mesmos estados de carregamento/erro/vazio já usados em outras listagens do site

### Requirement: Página Comprar exibe busca, simulação de financiamento e conteúdo educativo
A rota `/comprar` SHALL exibir um formulário de busca dedicado à compra, uma ação de simulação de financiamento via WhatsApp, uma seção de imóveis reais disponíveis para venda, e uma seção de conteúdo educativo sobre o processo de comprar.

#### Scenario: Buscar a partir da página Comprar
- **WHEN** um usuário preenche e submete a busca na página `/comprar`
- **THEN** o navegador é levado para `/busca` com o tipo de operação de compra já preenchido

#### Scenario: Acionar a simulação de financiamento
- **WHEN** um usuário clica numa das ações de simulação de financiamento na página `/comprar`
- **THEN** o sistema abre uma conversa de WhatsApp

#### Scenario: Imóveis reais em destaque no Comprar
- **WHEN** um usuário acessa `/comprar`
- **THEN** a página exibe imóveis disponíveis para venda vindos da API, respeitando os mesmos estados de carregamento/erro/vazio já usados em outras listagens do site

### Requirement: Página Sobre exibe os diferenciais da Chaves
A rota `/sobre` SHALL exibir os diferenciais institucionais da Chaves e uma ação final que leva à busca de imóveis.

#### Scenario: Acessar a página Sobre
- **WHEN** um usuário acessa `/sobre`
- **THEN** a página exibe os diferenciais institucionais e uma ação para buscar imóveis

#### Scenario: Clicar na ação final da página Sobre
- **WHEN** um usuário clica na ação final de buscar imóveis na página `/sobre`
- **THEN** o navegador é levado para `/busca`
