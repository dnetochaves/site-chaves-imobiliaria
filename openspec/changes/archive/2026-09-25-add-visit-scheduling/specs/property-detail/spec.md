## MODIFIED Requirements

### Requirement: Solicitação de contato para visita
O sistema SHALL permitir que qualquer usuário (autenticado ou não) envie uma solicitação de contato para visitar o imóvel exibido. Esta ação SHALL registrar um pedido para o time de vendas entrar em contato e continuar disponível como alternativa ao agendamento de um horário, inclusive quando o imóvel não tem horários disponíveis.

#### Scenario: Envio de solicitação de contato bem-sucedido
- **WHEN** um usuário preenche e envia o pedido de contato para o imóvel exibido
- **THEN** o sistema confirma visualmente que o pedido foi enviado, sem exigir um horário específico de visita

#### Scenario: Falha no envio da solicitação de contato
- **WHEN** o envio do pedido de contato falha (erro de rede ou resposta de erro da API)
- **THEN** o sistema exibe uma mensagem de erro, permitindo tentar novamente

## ADDED Requirements

### Requirement: Página de detalhe exibe os horários de visita disponíveis
A página de detalhe SHALL exibir uma seção "Agendar visita" com os horários de visita livres do imóvel (próximos 30 dias), agrupados por dia e ordenados do mais próximo para o mais distante. Os horários SHALL ser exibidos no horário de Salvador, independentemente do fuso do navegador do usuário. A seção SHALL ser visível para qualquer usuário, autenticado ou não.

#### Scenario: Imóvel com horários disponíveis
- **WHEN** um usuário abre a página de um imóvel publicado que tem horários de visita livres
- **THEN** a seção "Agendar visita" lista os horários agrupados por dia, no horário de Salvador

#### Scenario: Imóvel sem horários disponíveis
- **WHEN** um usuário abre a página de um imóvel publicado sem horários livres no período
- **THEN** a seção informa que não há horários disponíveis no momento, sem tratar isso como erro, e o pedido de contato continua disponível

#### Scenario: Carregando os horários
- **WHEN** os horários do imóvel estão sendo buscados
- **THEN** a seção exibe um indicador de carregamento

#### Scenario: Erro ao buscar os horários
- **WHEN** a busca dos horários falha
- **THEN** a seção exibe uma mensagem de erro, sem quebrar o restante da página

#### Scenario: Horário exibido no horário de Salvador
- **WHEN** um horário é `2026-10-01T14:00:00-03:00`
- **THEN** ele é exibido como 14:00 do dia 01/10/2026, mesmo que o navegador do usuário esteja em outro fuso

### Requirement: Usuário autenticado reserva um horário de visita
Ao escolher um horário, um usuário autenticado SHALL ver um formulário com telefone (obrigatório, até 30 caracteres) e observações (opcional). Ao confirmar, o sistema SHALL reservar o horário e exibir uma confirmação com a data e hora (no horário de Salvador) e o endereço do imóvel, com um link para "Minhas visitas". Depois de reservar, a lista de horários SHALL ser atualizada. O envio SHALL ficar indisponível enquanto a reserva está em andamento.

#### Scenario: Reserva bem-sucedida
- **WHEN** um usuário autenticado escolhe um horário, informa o telefone e confirma
- **THEN** o sistema exibe a confirmação com data, hora e endereço e um link para Minhas visitas, e o horário reservado deixa de aparecer na lista

#### Scenario: Telefone não informado
- **WHEN** um usuário tenta confirmar a reserva sem informar o telefone
- **THEN** o sistema impede o envio e indica que o telefone é obrigatório

#### Scenario: Reserva em andamento
- **WHEN** a reserva está sendo enviada
- **THEN** a ação de confirmar fica indisponível até a resposta chegar, evitando envios duplicados

### Requirement: Usuário não autenticado é levado ao login para reservar
Um usuário não autenticado SHALL poder ver os horários, mas, ao escolher um, SHALL ver uma ação para entrar em vez do formulário de reserva. Depois de entrar, o usuário SHALL voltar para a página do mesmo imóvel.

#### Scenario: Escolher um horário sem estar logado
- **WHEN** um usuário não autenticado escolhe um horário
- **THEN** o sistema oferece a ação de entrar para agendar, sem exibir o formulário de reserva

#### Scenario: Voltar para o imóvel depois de entrar
- **WHEN** um usuário aciona entrar a partir da seção de agendamento e conclui o login
- **THEN** ele volta para a página do mesmo imóvel

### Requirement: Erros da reserva são explicados em português
Quando a API recusar a reserva, o sistema SHALL exibir uma mensagem em português correspondente ao motivo, sem exibir o texto de erro da API: horário já reservado por outra pessoa; horário que já passou; imóvel que não está mais disponível; conflito com outra visita do usuário no mesmo horário; visita já agendada pelo usuário neste imóvel (com um link para Minhas visitas); sessão expirada (com ação para entrar de novo); telefone inválido; excesso de tentativas. Quando o motivo for horário já reservado ou horário passado, o sistema SHALL recarregar a lista de horários e desfazer a escolha.

#### Scenario: Horário já reservado por outra pessoa
- **WHEN** a API recusa a reserva porque o horário acabou de ser reservado por outra pessoa
- **THEN** o sistema informa que o horário não está mais disponível, pede para escolher outro e recarrega a lista de horários

#### Scenario: Horário que já passou
- **WHEN** a API recusa a reserva porque o horário já passou
- **THEN** o sistema informa que o horário já passou e recarrega a lista de horários

#### Scenario: Imóvel que deixou de estar disponível
- **WHEN** a API recusa a reserva porque o imóvel não está mais publicado
- **THEN** o sistema informa que o imóvel não está mais disponível

#### Scenario: Conflito com outra visita do usuário
- **WHEN** a API recusa a reserva porque o usuário já tem outra visita nesse horário
- **THEN** o sistema informa que o usuário já tem uma visita nesse horário

#### Scenario: Visita já agendada neste imóvel
- **WHEN** a API recusa a reserva porque o usuário já tem uma visita agendada neste imóvel
- **THEN** o sistema informa isso e oferece um link para Minhas visitas

#### Scenario: Sessão expirada
- **WHEN** a API recusa a reserva por falta de autenticação
- **THEN** o sistema informa que a sessão expirou e oferece a ação de entrar novamente

#### Scenario: Telefone inválido
- **WHEN** a API recusa a reserva porque o telefone é inválido
- **THEN** o sistema indica o problema no campo de telefone e mantém os dados preenchidos
