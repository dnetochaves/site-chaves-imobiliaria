# property-detail Specification

## Purpose
Exibe a página de detalhe de um imóvel — galeria, descrição, características, localização e preço detalhado — e concentra as ações que dependem de um imóvel específico: favoritar e solicitar contato/visita.

## Requirements

### Requirement: Página de detalhe exibe os dados completos do imóvel
O sistema SHALL exibir, para um imóvel identificado por ID na URL, uma galeria de fotos, título, endereço completo, especificações (área útil, quartos, banheiros, vagas de garagem), descrição, lista de características (amenidades) e o detalhamento do preço mensal (aluguel, condomínio, IPTU, seguro incêndio e total).

#### Scenario: Imóvel com todos os dados preenchidos
- **WHEN** a página de detalhe carrega um imóvel que tem fotos, descrição, amenidades e todos os valores de preço preenchidos
- **THEN** a página exibe a galeria, a descrição, a lista de características e o detalhamento completo do preço

#### Scenario: Item de preço ausente no detalhamento
- **WHEN** o imóvel carregado não tem um dos valores de preço preenchido (ex.: sem seguro incêndio)
- **THEN** a página omite essa linha do detalhamento, sem exibir um valor vazio ou zerado

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
O sistema SHALL permitir que qualquer usuário (autenticado ou não) envie uma solicitação de contato para visitar o imóvel exibido. Esta ação SHALL registrar um pedido para o time de vendas entrar em contato, e não SHALL agendar automaticamente um horário específico de visita.

#### Scenario: Envio de solicitação de contato bem-sucedido
- **WHEN** um usuário preenche e envia o pedido de contato para o imóvel exibido
- **THEN** o sistema confirma visualmente que o pedido foi enviado, sem exigir um horário específico de visita

#### Scenario: Falha no envio da solicitação de contato
- **WHEN** o envio do pedido de contato falha (erro de rede ou resposta de erro da API)
- **THEN** o sistema exibe uma mensagem de erro, permitindo tentar novamente

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
