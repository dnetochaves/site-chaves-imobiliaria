## Purpose

Dá à rota "Trabalhe conosco" — já referenciada no Footer — um jeito real de um corretor de imóveis interessado em parceria com a Chaves iniciar contato, sem fingir que existe um processo seletivo estruturado que a empresa não sustenta.

## ADDED Requirements

### Requirement: Página Trabalhe conosco é voltada a corretores parceiros
A rota `/trabalhe-conosco` SHALL apresentar o convite para corretores de imóveis se tornarem parceiros da Chaves, cobrindo pelo menos os formatos de parceria já confirmados: venda/locação dos imóveis da Chaves e atuação na administração/gestão de condomínios.

#### Scenario: Acessar a página Trabalhe conosco
- **WHEN** um usuário acessa `/trabalhe-conosco`
- **THEN** a página exibe o convite para corretores parceiros, cobrindo venda/locação dos imóveis da Chaves e administração/gestão de condomínios como formatos de parceria

### Requirement: Página Trabalhe conosco não apresenta um processo seletivo inexistente
A rota `/trabalhe-conosco` SHALL NOT exibir uma lista de vagas de emprego ou um processo seletivo estruturado, já que não existe nenhuma fonte de dados real para isso.

#### Scenario: Nenhuma vaga ou processo seletivo inventado
- **WHEN** um usuário acessa `/trabalhe-conosco`
- **THEN** a página não exibe nenhuma vaga de emprego específica nem etapas de um processo seletivo formal

### Requirement: Página Trabalhe conosco oferece um canal de contato
A rota `/trabalhe-conosco` SHALL exibir uma ação de contato para o corretor iniciar a conversa sobre parceria com a Chaves.

#### Scenario: Acionar o contato
- **WHEN** um usuário clica na ação de contato na página `/trabalhe-conosco`
- **THEN** o sistema abre uma conversa de WhatsApp
