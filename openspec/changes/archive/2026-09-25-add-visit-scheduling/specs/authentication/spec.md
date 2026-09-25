## MODIFIED Requirements

### Requirement: Callback troca o código por uma sessão
O sistema SHALL prover uma rota de callback que lê um código de autorização da URL, troca esse código por tokens de acesso junto à API, e estabelece uma sessão autenticada. Depois de estabelecer a sessão, o sistema SHALL levar o usuário de volta para a página em que ele iniciou o login, quando houver uma página de origem válida guardada, ou para a Home caso contrário.

#### Scenario: Callback com código válido
- **WHEN** o navegador chega na rota de callback com um código de autorização válido na URL
- **THEN** o sistema troca o código pelos tokens junto à API e o usuário passa a estar autenticado

#### Scenario: Callback com código inválido ou expirado
- **WHEN** o navegador chega na rota de callback com um código inválido, expirado ou ausente
- **THEN** o sistema exibe um estado de erro claro e não estabelece uma sessão autenticada

#### Scenario: Redirecionamento após login bem-sucedido
- **WHEN** a troca de código por tokens é concluída com sucesso e não há página de origem válida guardada
- **THEN** o usuário é redirecionado para a Home

#### Scenario: Retorno à página de origem
- **WHEN** a troca de código por tokens é concluída com sucesso e há uma página de origem válida guardada
- **THEN** o usuário é redirecionado para essa página, e a página de origem guardada é descartada

#### Scenario: Página de origem inválida ou externa
- **WHEN** a página de origem guardada não é um caminho interno do site (por exemplo, um endereço externo ou uma rota de autenticação)
- **THEN** o sistema ignora esse destino e redireciona o usuário para a Home

## ADDED Requirements

### Requirement: Login guarda a página de origem
Ao iniciar o login, o sistema SHALL guardar a página em que o usuário está (caminho e parâmetros) para retornar a ela depois do login, e SHALL guardar somente caminhos internos do site. Se não for possível guardar a página de origem, o login SHALL prosseguir normalmente.

#### Scenario: Guardar a origem ao iniciar o login
- **WHEN** um usuário não autenticado aciona o login estando em uma página do site (por exemplo, a página de um imóvel)
- **THEN** o sistema guarda essa página como destino de retorno antes de redirecionar para o login

#### Scenario: Origem não pode ser guardada
- **WHEN** o navegador não permite guardar a página de origem
- **THEN** o login prossegue normalmente e o usuário é levado para a Home depois de entrar

#### Scenario: Login iniciado a partir da rota de callback
- **WHEN** o usuário aciona "tentar novamente" na rota de callback, depois de um erro
- **THEN** o sistema não guarda a rota de callback como página de origem, e mantém qualquer destino que já estivesse guardado
