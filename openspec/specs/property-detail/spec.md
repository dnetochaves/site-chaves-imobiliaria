# property-detail Specification

## Purpose
Exibe a página de detalhe de um imóvel — galeria, descrição, características, localização e preço detalhado — e concentra as ações que dependem de um imóvel específico: favoritar e solicitar contato/visita.

## Requirements

### Requirement: Página de detalhe exibe os dados completos do imóvel
O sistema SHALL exibir, para um imóvel identificado por ID na URL, uma galeria de fotos, título, endereço completo, especificações (área útil, quartos, banheiros, vagas de garagem), descrição, lista de características (amenidades), o detalhamento do preço mensal (aluguel, condomínio, IPTU, seguro incêndio e total) e o tipo do imóvel (ex.: apartamento, casa, studio) quando esse dado estiver preenchido.

#### Scenario: Imóvel com todos os dados preenchidos
- **WHEN** a página de detalhe carrega um imóvel que tem fotos, descrição, amenidades e todos os valores de preço preenchidos
- **THEN** a página exibe a galeria, a descrição, a lista de características e o detalhamento completo do preço

#### Scenario: Item de preço ausente no detalhamento
- **WHEN** o imóvel carregado não tem um dos valores de preço preenchido (ex.: sem seguro incêndio)
- **THEN** a página omite essa linha do detalhamento, sem exibir um valor vazio ou zerado

#### Scenario: Imóvel com tipo definido
- **WHEN** o imóvel carregado tem o tipo definido
- **THEN** a página exibe o tipo do imóvel

#### Scenario: Imóvel sem tipo definido
- **WHEN** o imóvel carregado não tem o tipo definido (campo nulo)
- **THEN** a página não exibe nenhum indicador de tipo, sem mostrar um valor vazio ou um texto genérico no lugar

### Requirement: Localização do imóvel exibida num mapa
O sistema SHALL exibir um mapa centrado nas coordenadas da unidade, com um marcador indicando sua localização.

#### Scenario: Unidade com coordenadas válidas
- **WHEN** a unidade do imóvel carregado tem latitude e longitude
- **THEN** o mapa é centrado nessas coordenadas com um marcador na posição

### Requirement: Favoritar imóvel a partir da página de detalhe
O sistema SHALL permitir que um usuário autenticado favorite ou desfavorite a unidade do imóvel exibido, refletindo o estado atual (favoritado ou não) ao carregar a página. Para um usuário não autenticado, a ação SHALL iniciar o fluxo de login em vez de favoritar.

#### Scenario: Usuário autenticado favorita um imóvel não favoritado
- **WHEN** um usuário autenticado, visualizando um imóvel que ainda não está em seus favoritos, aciona o favoritar
- **THEN** o imóvel passa a constar nos favoritos do usuário e a página reflete o novo estado

#### Scenario: Usuário autenticado desfavorita um imóvel já favoritado
- **WHEN** um usuário autenticado, visualizando um imóvel que já está em seus favoritos, aciona o desfavoritar
- **THEN** o imóvel deixa de constar nos favoritos do usuário e a página reflete o novo estado

#### Scenario: Usuário não autenticado tenta favoritar
- **WHEN** um usuário não autenticado aciona o favoritar na página de detalhe
- **THEN** o sistema inicia o fluxo de login em vez de favoritar o imóvel

### Requirement: Solicitação de contato para visita
O sistema SHALL permitir que qualquer usuário (autenticado ou não) envie uma solicitação de contato para visitar o imóvel exibido. Esta ação SHALL registrar um pedido para o time de vendas entrar em contato e continuar disponível como alternativa ao agendamento de um horário, inclusive quando o imóvel não tem horários disponíveis.

#### Scenario: Envio de solicitação de contato bem-sucedido
- **WHEN** um usuário preenche e envia o pedido de contato para o imóvel exibido
- **THEN** o sistema confirma visualmente que o pedido foi enviado, sem exigir um horário específico de visita

#### Scenario: Falha no envio da solicitação de contato
- **WHEN** o envio do pedido de contato falha (erro de rede ou resposta de erro da API)
- **THEN** o sistema exibe uma mensagem de erro, permitindo tentar novamente

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

### Requirement: Contato direto via WhatsApp
O sistema SHALL prover um link direto para contato via WhatsApp a partir da página de detalhe, independente do estado de autenticação do usuário.

#### Scenario: Usuário aciona o contato via WhatsApp
- **WHEN** um usuário clica na ação de falar com a Chaves na página de detalhe
- **THEN** o sistema abre uma conversa de WhatsApp com uma mensagem pré-preenchida referenciando o imóvel

### Requirement: Estados de carregamento e erro na página de detalhe
A página de detalhe SHALL exibir um estado visual distinto para carregamento e para quando o imóvel não pode ser exibido (não encontrado ou erro de rede).

#### Scenario: Carregando
- **WHEN** os dados do imóvel estão sendo buscados
- **THEN** a página exibe um indicador de carregamento no lugar do conteúdo

#### Scenario: Imóvel não encontrado
- **WHEN** o ID informado na URL não corresponde a nenhum imóvel existente
- **THEN** a página exibe uma mensagem clara de que o imóvel não foi encontrado, em vez de uma página quebrada ou vazia

#### Scenario: Erro ao buscar o imóvel
- **WHEN** a busca dos dados do imóvel falha por erro de rede ou resposta de erro da API (diferente de não encontrado)
- **THEN** a página exibe uma mensagem de erro genérica

### Requirement: Página de detalhe linka para o corretor responsável
Quando o imóvel tiver um corretor atribuído, a página de detalhe SHALL exibir um link para o card público desse corretor (`/corretores/{slug}`). Quando não houver corretor atribuído, a página SHALL NOT exibir esse link.

#### Scenario: Imóvel com corretor atribuído
- **WHEN** a página de detalhe carrega um imóvel que tem um corretor atribuído
- **THEN** a página exibe um link para o card público desse corretor

#### Scenario: Imóvel sem corretor atribuído
- **WHEN** a página de detalhe carrega um imóvel sem corretor atribuído
- **THEN** a página não exibe nenhum link de corretor
