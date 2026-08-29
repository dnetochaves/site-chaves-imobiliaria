## Purpose

Dá à rota "Garantia" — já referenciada no Footer — conteúdo real explicando o produto de aluguel garantido oferecido a proprietários que anunciam com a Chaves.

## ADDED Requirements

### Requirement: Página Garantia exibe os diferenciais da garantia de aluguel
A rota `/garantia` SHALL exibir os diferenciais do produto de garantia de aluguel oferecido a proprietários, e uma ação que leva ao cadastro de imóvel.

#### Scenario: Acessar a página Garantia
- **WHEN** um usuário acessa `/garantia`
- **THEN** a página exibe os diferenciais da garantia de aluguel e uma ação para anunciar um imóvel

#### Scenario: Clicar na ação de anunciar
- **WHEN** um usuário clica na ação de anunciar imóvel na página `/garantia`
- **THEN** o navegador é levado para `/anunciar`
