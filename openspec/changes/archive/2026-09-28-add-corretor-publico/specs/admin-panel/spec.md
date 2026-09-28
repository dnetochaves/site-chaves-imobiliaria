## MODIFIED Requirements

### Requirement: Painel lista os corretores com busca
A página de corretores SHALL exibir a lista de corretores cadastrados, mostrando para cada um: nome, telefone, e-mail (quando houver), CRECI (número e UF, quando houver) e se está ativo. A página SHALL oferecer um alternador "mostrar inativos" (desligado por padrão, exibindo só os corretores ativos) e um campo de busca por nome que filtra a lista já carregada, sem nova chamada à API. Cada corretor SHALL oferecer um link "Ver card público" que abre sua página pública (`/corretores/{slug}`) em uma nova aba.

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

#### Scenario: Abrir o card público de um corretor
- **WHEN** um usuário staff aciona "Ver card público" em um corretor
- **THEN** a página pública daquele corretor abre em uma nova aba

### Requirement: Staff pode cadastrar ou editar um corretor
A página de corretores SHALL oferecer um formulário para cadastrar um corretor, com nome e telefone obrigatórios e e-mail, foto (URL), número do CRECI, UF do CRECI, bio, cidade e redes sociais (Instagram e LinkedIn) opcionais, e SHALL permitir editar esses mesmos campos de um corretor existente. O slug SHALL NOT ser digitado no cadastro (é gerado automaticamente a partir do nome); ao editar um corretor existente, o formulário SHALL exibir o slug atual e SHALL permitir alterá-lo. Ao salvar com sucesso, a lista SHALL refletir o corretor criado ou atualizado. Se a API recusar por já existir outro corretor com o mesmo número de CRECI na mesma UF, ou com o mesmo slug, o sistema SHALL exibir uma mensagem de erro associada ao campo correspondente (CRECI ou slug), sem descartar os demais dados preenchidos.

#### Scenario: Cadastrar um corretor com sucesso
- **WHEN** um usuário staff preenche nome e telefone (e, opcionalmente, e-mail, foto, CRECI, bio, cidade, redes sociais) e confirma o cadastro
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

#### Scenario: Slug não aparece no cadastro
- **WHEN** um usuário staff preenche o formulário de criar um corretor
- **THEN** o formulário não oferece um campo para digitar o slug

#### Scenario: Editar o slug de um corretor existente
- **WHEN** um usuário staff altera o slug de um corretor existente e confirma
- **THEN** o sistema salva o novo slug e a página pública do corretor passa a responder nesse endereço

#### Scenario: Slug duplicado
- **WHEN** o slug informado na edição já pertence a outro corretor
- **THEN** o sistema exibe uma mensagem indicando que o slug já está em uso, associada ao campo de slug
