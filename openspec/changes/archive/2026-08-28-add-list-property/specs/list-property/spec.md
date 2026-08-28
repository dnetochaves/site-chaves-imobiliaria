## Purpose

Permite que um usuário autenticado cadastre um imóvel de verdade (pra alugar e/ou vender), pra que ele passe a existir na plataforma e possa futuramente ser aprovado e publicado.

## ADDED Requirements

### Requirement: Cadastro de imóvel exige autenticação
O sistema SHALL exigir que o usuário esteja autenticado para acessar o formulário de cadastro de imóvel. Um usuário não autenticado que acessa a rota de cadastro SHALL ser levado a iniciar o fluxo de login, em vez de ver o formulário.

#### Scenario: Usuário não autenticado acessa o formulário
- **WHEN** um usuário não autenticado acessa a rota `/anunciar`
- **THEN** o sistema inicia o fluxo de login, sem exibir o formulário

#### Scenario: Usuário autenticado acessa o formulário
- **WHEN** um usuário autenticado acessa a rota `/anunciar`
- **THEN** o sistema exibe o formulário de cadastro de imóvel

### Requirement: Formulário coleta os dados essenciais do imóvel
O formulário SHALL coletar: endereço completo, características físicas (área útil, quartos, banheiros, vagas de garagem), título, descrição, tipo de operação (aluguel e/ou venda) e os valores comerciais correspondentes ao tipo de operação escolhido.

#### Scenario: Pelo menos um tipo de operação obrigatório
- **WHEN** um usuário tenta enviar o formulário sem marcar nem "disponível para aluguel" nem "disponível para venda"
- **THEN** o sistema impede o envio e indica que pelo menos um tipo de operação precisa ser escolhido

### Requirement: Endereço é geocodificado e confirmado antes do envio
O sistema SHALL converter o endereço digitado em coordenadas geográficas reais antes de permitir o envio do formulário, e SHALL exibir o resultado da geocodificação (endereço resolvido e localização num mapa) para confirmação do usuário. O sistema SHALL NOT permitir o envio do formulário sem uma geocodificação confirmada.

#### Scenario: Geocodificação bem-sucedida
- **WHEN** um usuário aciona a busca do endereço digitado
- **THEN** o sistema exibe o endereço resolvido e sua localização num mapa, para o usuário confirmar antes de enviar

#### Scenario: Tentar enviar sem confirmar a geocodificação
- **WHEN** um usuário tenta enviar o formulário sem ter confirmado um resultado de geocodificação
- **THEN** o sistema impede o envio

#### Scenario: Geocodificação sem resultado
- **WHEN** a busca pelo endereço digitado não retorna nenhum resultado
- **THEN** o sistema informa que não conseguiu localizar o endereço, sem quebrar o formulário

### Requirement: Fotos são referenciadas por URL
O sistema SHALL permitir que o usuário informe URLs de fotos já hospedadas externamente para associar ao anúncio. Este campo SHALL ser opcional.

#### Scenario: Cadastro com URLs de fotos
- **WHEN** um usuário informa uma ou mais URLs de fotos e envia o formulário
- **THEN** essas URLs são enviadas junto com o restante dos dados do imóvel

#### Scenario: Cadastro sem fotos
- **WHEN** um usuário envia o formulário sem informar nenhuma URL de foto
- **THEN** o envio prossegue normalmente, sem exigir fotos

### Requirement: Confirmação de cadastro bem-sucedido
Ao criar o imóvel com sucesso, o sistema SHALL exibir uma confirmação clara e um link para a página de detalhe do imóvel recém-criado.

#### Scenario: Cadastro bem-sucedido
- **WHEN** o formulário é enviado com sucesso
- **THEN** o sistema exibe uma confirmação e um link para a página de detalhe do imóvel criado

### Requirement: Erro no envio preserva os dados preenchidos
Se o envio do formulário falhar, o sistema SHALL exibir uma mensagem de erro clara e SHALL manter os dados já preenchidos pelo usuário, permitindo tentar novamente sem preencher tudo de novo.

#### Scenario: Falha no envio
- **WHEN** o envio do formulário falha (erro de rede ou resposta de erro da API)
- **THEN** o sistema exibe uma mensagem de erro e mantém os dados preenchidos no formulário
