## MODIFIED Requirements

### Requirement: Home exibe imóveis selecionados
A Home SHALL exibir uma seção com uma lista de imóveis em destaque, usando a capability de listagem de imóveis, incluindo um subtexto explicativo e um link para a listagem completa.

#### Scenario: Carregar a Home
- **WHEN** um usuário acessa a rota `/`
- **THEN** a seção "Selecionados para hoje" (ou equivalente) exibe uma listagem de imóveis vinda da API, respeitando os estados de carregamento/erro/vazio da listagem

#### Scenario: Link para ver todos os imóveis
- **WHEN** um usuário acessa a Home
- **THEN** a seção de imóveis em destaque exibe um link "Ver todos" que navega para a rota `/busca`

### Requirement: Busca a partir da Home navega para a tela de Busca
A Home SHALL prover um formulário de busca (local e tipo de operação) que, ao ser submetido, navega o usuário para a rota `/busca` com os critérios preenchidos como parâmetros de URL. A Home SHALL também exibir atalhos de bairro de acesso rápido próximos à busca, que navegam diretamente para `/busca` com o bairro já preenchido.

#### Scenario: Submissão da busca
- **WHEN** um usuário preenche o campo de local e/ou o tipo de operação e submete a busca
- **THEN** o navegador é levado para `/busca` com os valores preenchidos representados na query string

#### Scenario: Submissão sem preencher nenhum campo
- **WHEN** um usuário submete a busca sem preencher nenhum campo
- **THEN** o sistema não bloqueia a submissão nem exige preenchimento obrigatório, e navega para `/busca` sem parâmetros

#### Scenario: Clicar em um chip de bairro rápido
- **WHEN** um usuário clica em um dos chips de bairro exibidos junto à busca (ex.: "Pinheiros")
- **THEN** o navegador é levado para `/busca` com o parâmetro de bairro já preenchido

### Requirement: Atalhos de categoria navegam para a busca pré-filtrada
A Home SHALL exibir atalhos organizados por perfil de busca (ex.: morar sozinho, com família, com pets, primeiro imóvel), cada um com um ícone e uma descrição curta. Cada atalho SHALL navegar para `/busca` com o filtro correspondente preenchido na URL, EXCETO quando o atalho representar um pedido de contato humano (ex.: simulação com um especialista), caso em que SHALL abrir um canal de contato externo (ex.: WhatsApp) em vez de navegar para `/busca`.

#### Scenario: Clicar em um atalho de categoria
- **WHEN** um usuário clica em um atalho de perfil que representa um critério de busca (ex.: "Com pets")
- **THEN** o navegador é levado para `/busca` com o parâmetro de filtro correspondente já preenchido (ex.: `aceita_pets=true`)

#### Scenario: Clicar no atalho de contato
- **WHEN** um usuário clica no atalho que representa um pedido de simulação com um especialista
- **THEN** o sistema abre um canal de contato externo (ex.: link do WhatsApp) em vez de navegar para `/busca`

### Requirement: CTAs institucionais são links visíveis
A Home SHALL exibir um bloco de CTA para o serviço de gestão de condomínios e um bloco de CTA para cadastro de imóvel para aluguel. Cada bloco SHALL exibir pelo menos dois elementos clicáveis (uma ação primária e uma ação secundária). O bloco de condomínios SHALL também exibir um resumo ilustrativo de dados de prestação de contas de um condomínio de exemplo.

#### Scenario: CTA de condomínios visível
- **WHEN** um usuário acessa a Home
- **THEN** o bloco "Administramos o seu condomínio" está visível com uma ação primária (ex.: "Pedir uma proposta") e uma ação secundária (ex.: "Como funciona"), ambas clicáveis

#### Scenario: Resumo ilustrativo de condomínio visível
- **WHEN** um usuário acessa a Home
- **THEN** o bloco de condomínios exibe um resumo com nome do condomínio de exemplo e métricas de prestação de contas (arrecadado, despesas, inadimplência, fundo de reserva)

#### Scenario: CTA de cadastro de imóvel visível
- **WHEN** um usuário acessa a Home
- **THEN** o bloco "Tem um imóvel para alugar?" está visível com uma ação primária (ex.: "Anunciar imóvel") e uma ação secundária (ex.: "Falar com alguém"), ambas clicáveis
