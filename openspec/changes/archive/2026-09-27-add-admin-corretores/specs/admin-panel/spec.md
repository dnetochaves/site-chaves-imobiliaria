## MODIFIED Requirements

### Requirement: Painel oferece navegação entre suas seções
Toda página do painel administrativo SHALL exibir uma navegação que permita ir para a seção de imóveis, para a seção de leads, para a seção de visitas e para a seção de corretores, indicando qual seção está ativa.

#### Scenario: Navegar do painel de imóveis para os leads
- **WHEN** um usuário staff, em qualquer página do painel, aciona o link "Leads"
- **THEN** o sistema exibe a página de leads do painel

#### Scenario: Voltar para imóveis
- **WHEN** um usuário staff, na página de leads, aciona o link "Imóveis"
- **THEN** o sistema exibe a página inicial do painel (imóveis)

#### Scenario: Navegar para as visitas
- **WHEN** um usuário staff, em qualquer página do painel, aciona o link "Visitas"
- **THEN** o sistema exibe a página de visitas do painel, com a seção de visitas indicada como ativa

#### Scenario: Navegar para os corretores
- **WHEN** um usuário staff, em qualquer página do painel, aciona o link "Corretores"
- **THEN** o sistema exibe a página de corretores do painel, com a seção de corretores indicada como ativa

## ADDED Requirements

### Requirement: Painel lista os corretores com busca
A página de corretores SHALL exibir a lista de corretores cadastrados, mostrando para cada um: nome, telefone, e-mail (quando houver), CRECI (número e UF, quando houver) e se está ativo. A página SHALL oferecer um alternador "mostrar inativos" (desligado por padrão, exibindo só os corretores ativos) e um campo de busca por nome que filtra a lista já carregada, sem nova chamada à API.

#### Scenario: Lista de corretores ativos por padrão
- **WHEN** um usuário staff acessa a página de corretores
- **THEN** o painel exibe os corretores ativos, cada um com nome, telefone, e-mail, CRECI e status

#### Scenario: Mostrar também os inativos
- **WHEN** um usuário staff liga o alternador "mostrar inativos"
- **THEN** a lista passa a incluir também os corretores desativados, distinguíveis dos ativos

#### Scenario: Buscar por nome
- **WHEN** um usuário staff digita um trecho de nome no campo de busca
- **THEN** a lista exibe apenas os corretores cujo nome contém aquele trecho, sem nova chamada à API

#### Scenario: Nenhum corretor encontrado
- **WHEN** não há corretores cadastrados, ou nenhum corresponde à busca ou ao filtro de ativos/inativos
- **THEN** o painel exibe uma mensagem informando que não há corretores, em vez de uma área em branco

#### Scenario: Erro ao carregar a lista
- **WHEN** a busca dos corretores falha
- **THEN** o painel exibe uma mensagem de erro, sem quebrar o restante da página

### Requirement: Staff pode cadastrar ou editar um corretor
A página de corretores SHALL oferecer um formulário para cadastrar um corretor, com nome e telefone obrigatórios e e-mail, foto (URL), número do CRECI e UF do CRECI opcionais, e SHALL permitir editar esses mesmos campos de um corretor existente. Ao salvar com sucesso, a lista SHALL refletir o corretor criado ou atualizado. Se a API recusar por já existir outro corretor com o mesmo número de CRECI na mesma UF, o sistema SHALL exibir uma mensagem de erro associada aos campos de CRECI, sem descartar os demais dados preenchidos.

#### Scenario: Cadastrar um corretor com sucesso
- **WHEN** um usuário staff preenche nome e telefone (e, opcionalmente, e-mail, foto, CRECI) e confirma o cadastro
- **THEN** o sistema cria o corretor e a lista passa a exibi-lo

#### Scenario: Nome ou telefone não informados
- **WHEN** um usuário staff tenta cadastrar ou salvar um corretor sem informar nome ou telefone
- **THEN** o sistema impede o envio e indica que esses campos são obrigatórios

#### Scenario: Editar um corretor com sucesso
- **WHEN** um usuário staff altera um ou mais campos de um corretor existente e confirma
- **THEN** o sistema salva apenas os campos alterados e a lista passa a exibir os novos dados

#### Scenario: CRECI duplicado
- **WHEN** o número de CRECI e a UF informados já pertencem a outro corretor
- **THEN** o sistema exibe uma mensagem indicando que já existe um corretor com esse CRECI nessa UF, associada aos campos de CRECI

#### Scenario: Envio em andamento
- **WHEN** o cadastro ou a edição de um corretor está sendo enviado
- **THEN** a ação de salvar fica indisponível até a resposta chegar, evitando envios duplicados

### Requirement: Staff pode desativar ou reativar um corretor
Cada corretor na lista SHALL oferecer uma ação para desativar (se ativo) ou reativar (se inativo), sem pedir confirmação destrutiva, já que a ação não apaga o cadastro. Ao executar com sucesso, a lista SHALL refletir o novo estado do corretor.

#### Scenario: Desativar um corretor ativo
- **WHEN** um usuário staff aciona "Desativar" em um corretor ativo
- **THEN** o corretor passa a aparecer como inativo na lista

#### Scenario: Reativar um corretor inativo
- **WHEN** um usuário staff aciona "Reativar" em um corretor inativo
- **THEN** o corretor passa a aparecer como ativo na lista

#### Scenario: Ação recusada pela API
- **WHEN** a API recusa a desativação ou a reativação
- **THEN** o sistema exibe uma mensagem de erro em português e mantém o estado exibido como estava

#### Scenario: Ação em andamento
- **WHEN** a desativação ou a reativação está sendo enviada
- **THEN** a ação daquele corretor fica indisponível até a resposta chegar, evitando envios duplicados

### Requirement: Staff pode atribuir um corretor a um imóvel
A tela de moderação de um imóvel SHALL exibir o corretor atualmente atribuído a ele (quando houver) e SHALL oferecer um seletor, alimentado pelos corretores ativos, para atribuir um corretor ao imóvel ou trocar o corretor atribuído, além de uma ação para remover a atribuição atual. Ao atribuir ou remover com sucesso, a tela SHALL refletir o corretor atribuído (ou a ausência de um).

#### Scenario: Atribuir um corretor a um imóvel sem corretor
- **WHEN** um usuário staff, na tela de moderação de um imóvel sem corretor atribuído, escolhe um corretor no seletor
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

### Requirement: Staff pode atribuir um corretor a um lead
Cada lead na lista de leads SHALL exibir o corretor atualmente atribuído a ele (quando houver) e SHALL oferecer um seletor, alimentado pelos corretores ativos, para atribuir um corretor ao lead ou trocar o corretor atribuído, além de uma ação para remover a atribuição atual. Ao atribuir ou remover com sucesso, a lista SHALL refletir o corretor atribuído (ou a ausência de um) para aquele lead.

#### Scenario: Atribuir um corretor a um lead sem corretor
- **WHEN** um usuário staff, em um lead sem corretor atribuído, escolhe um corretor no seletor
- **THEN** o sistema atribui o corretor e a lista passa a exibi-lo naquele lead

#### Scenario: Trocar o corretor de um lead
- **WHEN** um usuário staff escolhe outro corretor no seletor de um lead que já tem corretor atribuído
- **THEN** o sistema substitui a atribuição, sem exigir que a anterior seja removida antes

#### Scenario: Remover a atribuição de um lead
- **WHEN** um usuário staff aciona remover atribuição em um lead com corretor
- **THEN** o sistema remove a atribuição e a lista deixa de exibir um corretor para aquele lead

#### Scenario: Corretor inativo recusado
- **WHEN** a API recusa a atribuição porque o corretor escolhido está inativo
- **THEN** o sistema exibe uma mensagem informando que o corretor está inativo e precisa ser reativado antes de ser atribuído

#### Scenario: Atribuição em andamento
- **WHEN** uma atribuição ou remoção está sendo enviada
- **THEN** o seletor e a ação de remover daquele lead ficam indisponíveis até a resposta chegar, evitando envios duplicados
