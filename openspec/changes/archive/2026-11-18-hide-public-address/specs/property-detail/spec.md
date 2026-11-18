## MODIFIED Requirements

### Requirement: Página de detalhe exibe os dados completos do imóvel
O sistema SHALL exibir, para um imóvel identificado por ID na URL, uma galeria de fotos, título, localização (somente bairro e cidade), especificações (área útil, quartos, banheiros, vagas de garagem), descrição, lista de características (amenidades), o detalhamento do preço mensal (aluguel, condomínio, IPTU, seguro incêndio e total) e o tipo do imóvel (ex.: apartamento, casa, studio) quando esse dado estiver preenchido. A página pública SHALL NOT exibir rua, número, complemento, CEP nem coordenadas do imóvel.

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

#### Scenario: Localização só com bairro e cidade
- **WHEN** a página de detalhe carrega um imóvel
- **THEN** a página exibe apenas o bairro e a cidade como localização, sem rua, número, CEP nem mapa

### Requirement: Usuário autenticado reserva um horário de visita
Ao escolher um horário, um usuário autenticado SHALL ver um formulário com telefone (obrigatório, até 30 caracteres) e observações (opcional). Ao confirmar, o sistema SHALL reservar o horário e exibir uma confirmação com a data e hora (no horário de Salvador), informando que o endereço completo fica disponível em "Minhas visitas", com um link para "Minhas visitas". Depois de reservar, a lista de horários SHALL ser atualizada. O envio SHALL ficar indisponível enquanto a reserva está em andamento.

#### Scenario: Reserva bem-sucedida
- **WHEN** um usuário autenticado escolhe um horário, informa o telefone e confirma
- **THEN** o sistema exibe a confirmação com data e hora, a indicação de que o endereço completo está em Minhas visitas e um link para Minhas visitas, e o horário reservado deixa de aparecer na lista

#### Scenario: Telefone não informado
- **WHEN** um usuário tenta confirmar a reserva sem informar o telefone
- **THEN** o sistema impede o envio e indica que o telefone é obrigatório

#### Scenario: Reserva em andamento
- **WHEN** a reserva está sendo enviada
- **THEN** a ação de confirmar fica indisponível até a resposta chegar, evitando envios duplicados

## REMOVED Requirements

### Requirement: Localização do imóvel exibida num mapa
**Reason**: O mapa precisa das coordenadas exatas do imóvel, que deixaram de ser públicas: o site público mostra só bairro e cidade.
**Migration**: A localização do imóvel na página de detalhe é o bairro e a cidade; o endereço completo é visto só pela equipe (no painel), pelo responsável pelo anúncio e pelo visitante, em "Minhas visitas", enquanto a visita está agendada.
