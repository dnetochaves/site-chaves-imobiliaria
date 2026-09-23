## Purpose

Dá conteúdo real à rota "Ajuda", já referenciada no Header e no Footer, oferecendo respostas às dúvidas mais comuns sobre como usar o site e um canal de contato direto para o que a FAQ não cobrir.

## ADDED Requirements

### Requirement: Página Ajuda exibe uma central de dúvidas
A rota `/ajuda` SHALL exibir uma lista de perguntas frequentes com suas respostas, cobrindo pelo menos: como buscar e visitar um imóvel, como funciona a garantia de aluguel para o proprietário, como anunciar um imóvel, e como se tornar corretor parceiro. Toda resposta SHALL descrever apenas comportamento já implementado no site, sem afirmar prazos, taxas ou políticas não confirmadas.

#### Scenario: Acessar a página Ajuda
- **WHEN** um usuário acessa `/ajuda`
- **THEN** a página exibe a lista de perguntas frequentes com suas respostas

### Requirement: Página Ajuda oferece contato direto via WhatsApp
A rota `/ajuda` SHALL exibir uma ação que abre uma conversa de WhatsApp com a Chaves, para dúvidas não cobertas pela central de dúvidas.

#### Scenario: Acionar o contato via WhatsApp na página Ajuda
- **WHEN** um usuário clica na ação de contato via WhatsApp em `/ajuda`
- **THEN** o sistema abre uma conversa de WhatsApp
