## MODIFIED Requirements

### Requirement: Estado de requisições de dados
Toda chamada de leitura de dados da API feita por um componente SHALL expor de forma distinguível os estados de carregamento, sucesso (com os dados) e erro. O erro exposto SHALL ser estruturado, com status HTTP, código estável, mensagem e lista de detalhes por campo (quando houver), seguindo o formato de erro padronizado da API.

#### Scenario: Requisição em andamento
- **WHEN** um componente dispara uma busca de dados na API
- **THEN** o componente pode identificar que a requisição está em andamento antes da resposta chegar

#### Scenario: Requisição falha
- **WHEN** a API retorna um erro (ex.: status 4xx ou 5xx) para uma requisição
- **THEN** o componente recebe um estado de erro distinguível do estado de sucesso, com informação suficiente para exibir feedback ao usuário: status, código, mensagem e, em erros de validação, os detalhes por campo

#### Scenario: Resposta de erro fora do formato esperado
- **WHEN** a resposta de erro não segue o formato padronizado da API (ex.: falha de rede ou resposta não-JSON de um proxy)
- **THEN** o componente ainda recebe um estado de erro estruturado com um código e uma mensagem genéricos, sem falhar ao interpretar a resposta

#### Scenario: Limite de requisições excedido
- **WHEN** a API responde 429 com o header de tempo de espera
- **THEN** o erro exposto ao componente inclui esse tempo em segundos, e a interface informa ao usuário que ele deve aguardar antes de tentar de novo, sem re-tentar automaticamente
