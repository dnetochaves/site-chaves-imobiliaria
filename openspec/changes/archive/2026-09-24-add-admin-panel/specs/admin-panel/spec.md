## Purpose

Oferece à equipe da Chaves (usuários staff) uma área administrativa dentro do site para moderar anúncios de imóveis, sem depender de chamadas diretas à API.

## ADDED Requirements

### Requirement: Painel administrativo é restrito a usuários staff
O sistema SHALL permitir o acesso às páginas do painel administrativo (`/admin` e subrotas) apenas a usuários autenticados com permissão de staff. Um usuário autenticado sem permissão de staff SHALL ver a mesma tela de "Página não encontrada" exibida para rotas inexistentes, sem qualquer indicação de que o painel existe. Um usuário não autenticado SHALL ser levado a iniciar o fluxo de login.

#### Scenario: Usuário staff acessa o painel
- **WHEN** um usuário autenticado com permissão de staff acessa `/admin`
- **THEN** o sistema exibe a página inicial do painel administrativo

#### Scenario: Usuário autenticado sem permissão de staff acessa o painel
- **WHEN** um usuário autenticado sem permissão de staff acessa `/admin` (ou qualquer subrota)
- **THEN** o sistema exibe "Página não encontrada", sem exibir nenhum conteúdo do painel

#### Scenario: Usuário não autenticado acessa o painel
- **WHEN** um usuário não autenticado acessa `/admin`
- **THEN** o sistema inicia o fluxo de login, sem exibir conteúdo do painel

#### Scenario: Estado da sessão ainda em verificação
- **WHEN** a sessão do usuário ainda está sendo validada ao acessar `/admin`
- **THEN** o sistema exibe um indicador de carregamento, sem exibir o painel nem "Página não encontrada" antes de saber se o usuário é staff

### Requirement: Painel lista os imóveis publicados
O painel SHALL exibir a lista de imóveis publicados, com título, localização e status de cada um, e SHALL oferecer para cada imóvel a ação de abrir seus detalhes de moderação.

#### Scenario: Lista de publicados carregada
- **WHEN** um usuário staff acessa a página inicial do painel
- **THEN** o painel exibe os imóveis publicados, cada um com título, localização e status

#### Scenario: Nenhum imóvel publicado
- **WHEN** não há imóveis publicados
- **THEN** o painel exibe uma mensagem informando que não há imóveis, em vez de uma área em branco

#### Scenario: Erro ao carregar a lista
- **WHEN** a busca dos imóveis publicados falha
- **THEN** o painel exibe uma mensagem de erro, sem quebrar o restante da página

### Requirement: Painel permite abrir um imóvel pelo ID
O painel SHALL oferecer um campo para informar o ID de um imóvel e abrir sua tela de moderação, independente do status do imóvel (inclusive não publicados).

#### Scenario: Abrir imóvel existente por ID
- **WHEN** um usuário staff informa o ID de um imóvel existente e confirma
- **THEN** o sistema exibe a tela de moderação daquele imóvel com seus dados e status atual

#### Scenario: Abrir imóvel inexistente por ID
- **WHEN** um usuário staff informa o ID de um imóvel que não existe
- **THEN** o sistema informa que o imóvel não foi encontrado

#### Scenario: ID inválido
- **WHEN** um usuário staff tenta abrir um imóvel com um valor que não é um número inteiro positivo
- **THEN** o sistema não navega e indica que o ID é inválido

### Requirement: Staff pode aprovar, pausar ou rejeitar um imóvel
A tela de moderação de um imóvel SHALL exibir seus dados principais e seu status atual, e SHALL oferecer as ações de aprovar, pausar e rejeitar. Ao executar uma ação com sucesso, a tela SHALL refletir o novo status do imóvel. Se a API recusar a ação (ex.: transição de status não permitida), o sistema SHALL exibir uma mensagem de erro em português indicando que a ação não pôde ser concluída e que pode não ser permitida para o status atual do imóvel, mantendo o status exibido inalterado.

#### Scenario: Aprovar um imóvel
- **WHEN** um usuário staff aciona "Aprovar" na tela de moderação de um imóvel
- **THEN** o sistema envia a aprovação e a tela passa a exibir o novo status retornado pela API

#### Scenario: Pausar um imóvel
- **WHEN** um usuário staff aciona "Pausar" na tela de moderação de um imóvel
- **THEN** o sistema envia a pausa e a tela passa a exibir o novo status retornado pela API

#### Scenario: Rejeitar um imóvel
- **WHEN** um usuário staff aciona "Rejeitar" na tela de moderação de um imóvel
- **THEN** o sistema envia a rejeição e a tela passa a exibir o novo status retornado pela API

#### Scenario: Ação recusada pela API
- **WHEN** a API recusa uma ação de moderação (ex.: transição de status inválida)
- **THEN** o sistema exibe uma mensagem de erro em português indicando que a ação não pôde ser concluída e mantém o status exibido como estava

#### Scenario: Ação em andamento
- **WHEN** uma ação de moderação está sendo enviada
- **THEN** os botões de ação ficam indisponíveis até a resposta chegar, evitando envios duplicados
