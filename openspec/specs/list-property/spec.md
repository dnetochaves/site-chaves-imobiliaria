# list-property Specification

## Purpose
Permite que um usuário autenticado cadastre um imóvel de verdade (pra alugar e/ou vender), pra que ele passe a existir na plataforma e possa futuramente ser aprovado e publicado.

## Requirements

### Requirement: Cadastro de imóvel exige autenticação
O sistema SHALL exigir que o usuário esteja autenticado para acessar o formulário de cadastro de imóvel. Um usuário não autenticado que acessa a rota de cadastro SHALL ser levado a iniciar o fluxo de login, em vez de ver o formulário.

#### Scenario: Usuário não autenticado acessa o formulário
- **WHEN** um usuário não autenticado acessa a rota `/anunciar`
- **THEN** o sistema inicia o fluxo de login, sem exibir o formulário

#### Scenario: Usuário autenticado acessa o formulário
- **WHEN** um usuário autenticado acessa a rota `/anunciar`
- **THEN** o sistema exibe o formulário de cadastro de imóvel

### Requirement: Formulário coleta os dados essenciais do imóvel
O formulário SHALL coletar: localização (bairro, cidade e estado obrigatórios; rua, número, complemento e CEP opcionais), características físicas (área útil obrigatória; quartos, banheiros, vagas de garagem), título, descrição, tipo de operação (aluguel e/ou venda), os valores comerciais correspondentes ao tipo de operação escolhido (no aluguel, o seguro incêndio é opcional e conta como zero quando não informado) e, opcionalmente, o tipo do imóvel (apartamento, casa, cobertura, studio, kitnet, terreno, comercial ou outro) e observações (nota exibida no detalhe do imóvel). Para usuários da equipe, o formulário SHALL oferecer também o código interno do imóvel (opcional).

#### Scenario: Pelo menos um tipo de operação obrigatório
- **WHEN** um usuário tenta enviar o formulário sem marcar nem "disponível para aluguel" nem "disponível para venda"
- **THEN** o sistema impede o envio e indica que pelo menos um tipo de operação precisa ser escolhido

#### Scenario: Cadastro com tipo de imóvel especificado
- **WHEN** um usuário seleciona um tipo de imóvel e envia o formulário
- **THEN** esse tipo é enviado junto com o restante dos dados do imóvel

#### Scenario: Cadastro sem tipo de imóvel especificado
- **WHEN** um usuário envia o formulário sem selecionar um tipo de imóvel
- **THEN** o envio prossegue normalmente, sem exigir esse campo

#### Scenario: Cadastro sem rua, número e CEP
- **WHEN** um usuário preenche bairro, cidade, estado e os demais campos obrigatórios, deixando rua, número e CEP em branco, e envia o formulário
- **THEN** o envio prossegue normalmente, sem exigir o endereço detalhado

#### Scenario: Aluguel sem seguro incêndio
- **WHEN** um usuário marca aluguel, informa aluguel, condomínio e IPTU, deixa o seguro incêndio em branco e envia o formulário
- **THEN** o envio prossegue normalmente

#### Scenario: Código interno só para a equipe
- **WHEN** um usuário que não é da equipe abre o formulário
- **THEN** o formulário não oferece o campo de código interno

#### Scenario: Código interno já em uso
- **WHEN** a API recusa o envio porque o código interno informado já pertence a outro anúncio ativo
- **THEN** o sistema informa que o código já está em uso e mantém os dados preenchidos

### Requirement: Endereço é geocodificado e confirmado antes do envio
Quando o usuário informa rua e número, o sistema SHALL oferecer a busca do endereço em coordenadas geográficas e SHALL exibir o resultado (endereço resolvido e localização num mapa) para confirmação do usuário; as coordenadas confirmadas são enviadas junto com o cadastro. A geocodificação SHALL ser opcional: o sistema SHALL NOT impedir o envio do formulário por falta de uma geocodificação confirmada.

#### Scenario: Geocodificação bem-sucedida
- **WHEN** um usuário aciona a busca do endereço digitado
- **THEN** o sistema exibe o endereço resolvido e sua localização num mapa, para o usuário confirmar antes de enviar

#### Scenario: Tentar enviar sem confirmar a geocodificação
- **WHEN** um usuário envia o formulário sem ter confirmado um resultado de geocodificação
- **THEN** o envio prossegue normalmente, sem coordenadas

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
