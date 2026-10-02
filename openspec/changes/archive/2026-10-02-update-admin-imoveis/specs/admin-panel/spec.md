## RENAMED Requirements

- FROM: `### Requirement: Painel lista os imóveis publicados`
- TO: `### Requirement: Painel lista os imóveis de todos os status com filtros`

- FROM: `### Requirement: Staff pode aprovar, pausar ou rejeitar um imóvel`
- TO: `### Requirement: Staff gerencia a publicação de um imóvel pela lista`

## MODIFIED Requirements

### Requirement: Painel lista os imóveis de todos os status com filtros
A página inicial do painel SHALL exibir a lista paginada (20 por página) de imóveis em qualquer status — rascunho, em análise, publicado, pausado, alugado, vendido ou removido —, mostrando para cada um: foto de capa (quando houver), título, endereço (bairro e cidade), status em português, data de cadastro e o corretor atribuído (ou a ausência dele), e SHALL oferecer para cada imóvel a ação de abrir seus detalhes. O painel SHALL permitir filtrar por status (abrindo em "Todos"), por corretor (incluindo "Sem corretor") e por busca de texto, SHALL permitir ordenar por mais novos (padrão) ou mais antigos, e SHALL exibir a contagem total.

#### Scenario: Lista de publicados carregada
- **WHEN** um usuário staff acessa a página inicial do painel
- **THEN** o painel exibe os imóveis de todos os status (inclusive os publicados), cada um com título, localização, status e corretor atribuído, e a contagem total

#### Scenario: Imóveis pausados aparecem na lista
- **WHEN** existem imóveis pausados
- **THEN** a lista os exibe, com o status "Pausado", sem ser preciso saber o ID

#### Scenario: Filtrar por status
- **WHEN** um usuário staff escolhe um status no filtro (ex.: "Pausado")
- **THEN** a lista exibe apenas imóveis com aquele status, voltando para a primeira página

#### Scenario: Filtrar por corretor
- **WHEN** um usuário staff escolhe um corretor no filtro
- **THEN** a lista exibe apenas os imóveis atribuídos àquele corretor

#### Scenario: Filtrar imóveis sem corretor
- **WHEN** um usuário staff escolhe "Sem corretor" no filtro de corretor
- **THEN** a lista exibe apenas os imóveis que não têm corretor atribuído

#### Scenario: Buscar por texto
- **WHEN** um usuário staff digita um texto na busca e confirma
- **THEN** a lista exibe apenas os imóveis que correspondem à busca, voltando para a primeira página

#### Scenario: Ordenar por mais antigos
- **WHEN** um usuário staff escolhe a ordenação "Mais antigos"
- **THEN** a lista passa a exibir os imóveis do cadastro mais antigo para o mais novo

#### Scenario: Navegar entre páginas
- **WHEN** há mais imóveis do que cabem em uma página e o usuário aciona outra página
- **THEN** a lista exibe os imóveis daquela página, mantendo os filtros

#### Scenario: Nenhum imóvel publicado
- **WHEN** nenhum imóvel atende aos filtros (ou não há imóveis)
- **THEN** o painel exibe uma mensagem informando que não há imóveis, em vez de uma área em branco

#### Scenario: Erro ao carregar a lista
- **WHEN** a busca dos imóveis falha
- **THEN** o painel exibe uma mensagem de erro, sem quebrar o restante da página

### Requirement: Staff gerencia a publicação de um imóvel pela lista
Cada imóvel da lista SHALL oferecer exatamente as ações de publicação que a API informa como permitidas naquele momento (aprovar, pausar, rejeitar e republicar), sem oferecer nenhuma outra e sem o painel decidir por conta própria quais valem para cada status. Pausar e rejeitar SHALL pedir confirmação antes de enviar; aprovar e republicar SHALL ser enviados direto. Ao pausar um imóvel cuja unidade tem visitas agendadas futuras, a confirmação SHALL avisar que as visitas continuam marcadas, mas que ninguém mais consegue reservar horários. Ao executar uma ação com sucesso, a lista SHALL refletir o novo status. Um imóvel pausado sem nenhuma ação permitida SHALL exibir a explicação de que a unidade já tem outro anúncio ativo. Se a API recusar a ação, o sistema SHALL exibir uma mensagem em português conforme o motivo, mantendo o status exibido até a lista ser atualizada. Enquanto uma ação está em andamento, as ações daquele imóvel SHALL ficar indisponíveis.

#### Scenario: Aprovar um imóvel
- **WHEN** um usuário staff aciona "Aprovar" em um imóvel em análise
- **THEN** o imóvel é publicado e a lista passa a exibir o novo status

#### Scenario: Pausar um imóvel
- **WHEN** um usuário staff aciona "Pausar" em um imóvel publicado e confirma
- **THEN** o imóvel é pausado e a lista passa a exibir o novo status

#### Scenario: Rejeitar um imóvel
- **WHEN** um usuário staff aciona "Rejeitar" em um imóvel em análise e confirma
- **THEN** o imóvel é removido e a lista passa a exibir o novo status

#### Scenario: Republicar um imóvel pausado
- **WHEN** um usuário staff aciona "Republicar" em um imóvel pausado
- **THEN** o imóvel volta a ser publicado e a lista passa a exibir o novo status

#### Scenario: Apenas as ações permitidas são oferecidas
- **WHEN** a API informa que um imóvel aceita apenas determinadas ações
- **THEN** a lista exibe um botão para cada ação informada e nenhum botão a mais

#### Scenario: Imóvel sem ações permitidas
- **WHEN** um imóvel não aceita nenhuma ação (ex.: removido)
- **THEN** a lista não exibe nenhuma ação de publicação para ele

#### Scenario: Imóvel pausado cuja unidade já tem outro anúncio ativo
- **WHEN** um imóvel pausado não aceita nenhuma ação
- **THEN** a lista exibe a explicação de que a unidade já tem outro anúncio ativo

#### Scenario: Desistir de pausar ou rejeitar
- **WHEN** um usuário staff aciona "Pausar" ou "Rejeitar" e recusa a confirmação
- **THEN** nada é enviado e o imóvel continua como estava

#### Scenario: Aviso de visitas agendadas ao pausar
- **WHEN** um usuário staff aciona "Pausar" em um imóvel cuja unidade tem visitas agendadas futuras
- **THEN** a confirmação informa quantas visitas há e que elas continuam marcadas, mas ninguém mais consegue reservar horários

#### Scenario: Pausar sem visitas agendadas
- **WHEN** um usuário staff aciona "Pausar" em um imóvel cuja unidade não tem visitas agendadas futuras
- **THEN** a confirmação não exibe o aviso de visitas

#### Scenario: Imóvel mudou de status
- **WHEN** a API recusa a ação porque o imóvel já mudou de status (outra pessoa da equipe agiu antes)
- **THEN** o sistema informa que o imóvel mudou de status e atualiza a lista

#### Scenario: Unidade já tem outro anúncio ativo ao republicar
- **WHEN** a API recusa "Republicar" porque a unidade já tem outro anúncio em análise ou publicado
- **THEN** o sistema informa que a unidade já tem outro anúncio ativo e mantém o imóvel pausado

#### Scenario: Ação recusada pela API
- **WHEN** a API recusa a ação por qualquer outro motivo (diferente dos dois casos acima)
- **THEN** o sistema exibe uma mensagem de erro em português e mantém o status exibido

#### Scenario: Ação em andamento
- **WHEN** uma ação de publicação está sendo enviada
- **THEN** as ações daquele imóvel ficam indisponíveis até a resposta chegar, evitando envios duplicados

### Requirement: Staff pode atribuir um corretor a um imóvel
A lista de imóveis e a tela de detalhe de um imóvel SHALL exibir o corretor atualmente atribuído a ele (quando houver) e SHALL oferecer um seletor, alimentado pelos corretores ativos, para atribuir um corretor ao imóvel ou trocar o corretor atribuído, além de uma ação para remover a atribuição atual. Ao atribuir ou remover com sucesso, a lista e o detalhe SHALL refletir o corretor atribuído (ou a ausência de um).

#### Scenario: Atribuir um corretor a um imóvel sem corretor
- **WHEN** um usuário staff, na lista ou no detalhe de um imóvel sem corretor atribuído, escolhe um corretor no seletor
- **THEN** o sistema atribui o corretor e a tela passa a exibi-lo como responsável pelo imóvel

#### Scenario: Trocar o corretor de um imóvel
- **WHEN** um usuário staff escolhe outro corretor no seletor de um imóvel que já tem corretor atribuído
- **THEN** o sistema substitui a atribuição, sem exigir que a anterior seja removida antes

#### Scenario: Remover a atribuição de um imóvel
- **WHEN** um usuário staff aciona remover atribuição em um imóvel com corretor
- **THEN** o sistema remove a atribuição e a tela deixa de exibir um corretor responsável

#### Scenario: Corretor inativo recusado
- **WHEN** a API recusa a atribuição porque o corretor escolhido está inativo
- **THEN** o sistema exibe uma mensagem informando que o corretor está inativo e precisa ser reativado antes de ser atribuído

#### Scenario: Atribuição em andamento
- **WHEN** uma atribuição ou remoção está sendo enviada
- **THEN** o seletor e a ação de remover ficam indisponíveis até a resposta chegar, evitando envios duplicados

#### Scenario: Atribuir pela lista reflete no detalhe
- **WHEN** um usuário staff atribui um corretor a um imóvel pela lista e depois abre o detalhe desse imóvel
- **THEN** o detalhe exibe o corretor atribuído

## ADDED Requirements

### Requirement: Detalhe do imóvel no painel exibe dados e status sem ações de publicação
A tela de detalhe de um imóvel no painel SHALL exibir seus dados principais e seu status atual em português, o seletor de corretor e um link para a página pública do imóvel, e SHALL oferecer um link para voltar à lista de imóveis do painel, onde as ações de publicação são executadas. A tela de detalhe SHALL NOT oferecer as ações de aprovar, pausar, rejeitar ou republicar.

#### Scenario: Detalhe exibe dados e status
- **WHEN** um usuário staff abre o detalhe de um imóvel pelo ID
- **THEN** a tela exibe título, endereço e o status em português, independentemente do status do imóvel

#### Scenario: Detalhe sem ações de publicação
- **WHEN** um usuário staff abre o detalhe de um imóvel
- **THEN** a tela não oferece botões de aprovar, pausar, rejeitar ou republicar

#### Scenario: Voltar para a lista
- **WHEN** um usuário staff aciona o link para a lista de imóveis na tela de detalhe
- **THEN** o painel exibe a lista de imóveis
