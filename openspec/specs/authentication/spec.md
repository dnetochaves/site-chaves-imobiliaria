# authentication Specification

## Purpose
Permite que um usuário faça login no site via OAuth e mantenha uma sessão autenticada, para que funcionalidades que dependem de identificação do usuário (favoritar imóveis, agendar visitas) possam existir em changes futuros.

## Requirements

### Requirement: Login inicia o fluxo OAuth
O sistema SHALL prover uma ação de login que redireciona o navegador para o endpoint de autorização OAuth do backend.

#### Scenario: Iniciar login
- **WHEN** um usuário não autenticado aciona o login
- **THEN** o navegador é redirecionado para o endpoint de login OAuth do backend

### Requirement: Callback troca o código por uma sessão
O sistema SHALL prover uma rota de callback que lê um código de autorização da URL, troca esse código por tokens de acesso junto à API, e estabelece uma sessão autenticada.

#### Scenario: Callback com código válido
- **WHEN** o navegador chega na rota de callback com um código de autorização válido na URL
- **THEN** o sistema troca o código pelos tokens junto à API e o usuário passa a estar autenticado

#### Scenario: Callback com código inválido ou expirado
- **WHEN** o navegador chega na rota de callback com um código inválido, expirado ou ausente
- **THEN** o sistema exibe um estado de erro claro e não estabelece uma sessão autenticada

#### Scenario: Redirecionamento após login bem-sucedido
- **WHEN** a troca de código por tokens é concluída com sucesso
- **THEN** o usuário é redirecionado para a Home

### Requirement: Sessão é validada ao carregar a aplicação
Ao carregar a aplicação, SE existir uma sessão salva, o sistema SHALL validá-la junto à API antes de considerar o usuário autenticado.

#### Scenario: Sessão salva ainda válida
- **WHEN** a aplicação carrega e existe uma sessão salva com token ainda válido
- **THEN** o usuário é considerado autenticado sem precisar logar novamente

#### Scenario: Sessão salva expirada
- **WHEN** a aplicação carrega, existe uma sessão salva, e o token de acesso está expirado
- **THEN** o sistema tenta renovar a sessão automaticamente antes de considerar o usuário deslogado

#### Scenario: Sessão salva não renovável
- **WHEN** a tentativa de renovação automática também falha
- **THEN** o sistema limpa a sessão salva e trata o usuário como não autenticado

### Requirement: Chamadas de API autenticadas incluem o token da sessão
Toda chamada à API que exigir autenticação SHALL incluir o token de acesso da sessão atual, quando existir uma sessão autenticada.

#### Scenario: Chamada autenticada com sessão ativa
- **WHEN** o sistema faz uma chamada a um endpoint autenticado da API enquanto existe uma sessão ativa
- **THEN** a chamada inclui o token de acesso da sessão

### Requirement: Logout encerra a sessão
O sistema SHALL prover uma ação de logout que invalida a sessão junto à API e limpa o estado de autenticação local.

#### Scenario: Logout bem-sucedido
- **WHEN** um usuário autenticado aciona o logout
- **THEN** a sessão é invalidada junto à API, os dados de sessão salvos localmente são removidos, e o usuário passa a ser tratado como não autenticado
