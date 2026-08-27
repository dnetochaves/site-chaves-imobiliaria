## Purpose

Permite que um usuário autenticado veja e gerencie a lista de imóveis que favoritou, num único lugar.

## ADDED Requirements

### Requirement: Página de favoritos exige autenticação
O sistema SHALL exigir que o usuário esteja autenticado para ver a lista de favoritos. Um usuário não autenticado que acessa a rota de favoritos SHALL ser levado a iniciar o fluxo de login, em vez de ver a lista.

#### Scenario: Usuário não autenticado acessa a página de favoritos
- **WHEN** um usuário não autenticado acessa a rota `/favoritos`
- **THEN** o sistema inicia o fluxo de login, sem exibir nenhuma lista de favoritos

#### Scenario: Usuário autenticado acessa a página de favoritos
- **WHEN** um usuário autenticado acessa a rota `/favoritos`
- **THEN** o sistema exibe a lista de imóveis favoritados desse usuário

### Requirement: Lista de favoritos exibe os imóveis favoritados
O sistema SHALL exibir, para cada imóvel favoritado, ao menos a localização e as características físicas da unidade (área, quartos). Quando o imóvel favoritado tiver um anúncio ativo, o sistema SHALL também exibir os dados comerciais do anúncio (título, preço).

#### Scenario: Favorito com anúncio ativo
- **WHEN** um item da lista de favoritos tem um anúncio ativo associado
- **THEN** o item exibe o título e o preço do anúncio, além dos dados da unidade

#### Scenario: Favorito sem anúncio ativo
- **WHEN** um item da lista de favoritos não tem mais nenhum anúncio ativo associado (ex.: o anúncio foi pausado ou removido depois de favoritado)
- **THEN** o item exibe os dados da unidade disponíveis, com uma indicação clara de que não há anúncio ativo no momento, sem exibir título ou preço de anúncio

### Requirement: Item de favorito navega para o detalhe quando há anúncio ativo
Um item da lista de favoritos com anúncio ativo SHALL ser um elemento navegável que leva à página de detalhe daquele imóvel. Um item sem anúncio ativo SHALL NOT ser navegável.

#### Scenario: Clicar num favorito com anúncio ativo
- **WHEN** um usuário clica num item da lista de favoritos que tem um anúncio ativo
- **THEN** o navegador leva à página de detalhe daquele imóvel

#### Scenario: Tentar interagir com um favorito sem anúncio ativo
- **WHEN** um item da lista de favoritos não tem anúncio ativo
- **THEN** o item não oferece nenhuma navegação, mas continua permitindo removê-lo dos favoritos

### Requirement: Remover um favorito diretamente da lista
O sistema SHALL permitir que o usuário remova um imóvel dos favoritos diretamente a partir da lista, sem precisar acessar a página de detalhe.

#### Scenario: Remover um favorito
- **WHEN** um usuário aciona a remoção de um item na lista de favoritos
- **THEN** o item deixa de constar na lista de favoritos do usuário

### Requirement: Estados de carregamento, erro e lista vazia nos favoritos
A página de favoritos SHALL exibir um estado visual distinto para carregamento, para erro na busca, e para quando o usuário autenticado não tem nenhum favorito.

#### Scenario: Carregando
- **WHEN** a busca dos favoritos está em andamento
- **THEN** a página exibe um indicador de carregamento no lugar da lista

#### Scenario: Erro na busca
- **WHEN** a busca dos favoritos falha (erro de rede ou resposta de erro da API)
- **THEN** a página exibe uma mensagem de erro, sem quebrar o restante da página

#### Scenario: Nenhum favorito
- **WHEN** um usuário autenticado sem nenhum imóvel favoritado acessa a página de favoritos
- **THEN** a página exibe uma mensagem informando que não há favoritos ainda, em vez de uma área em branco
