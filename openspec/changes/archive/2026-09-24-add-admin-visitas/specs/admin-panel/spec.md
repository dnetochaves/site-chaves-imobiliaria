## MODIFIED Requirements

### Requirement: Painel oferece navegação entre suas seções
Toda página do painel administrativo SHALL exibir uma navegação que permita ir para a seção de imóveis, para a seção de leads e para a seção de visitas, indicando qual seção está ativa.

#### Scenario: Navegar do painel de imóveis para os leads
- **WHEN** um usuário staff, em qualquer página do painel, aciona o link "Leads"
- **THEN** o sistema exibe a página de leads do painel

#### Scenario: Voltar para imóveis
- **WHEN** um usuário staff, na página de leads, aciona o link "Imóveis"
- **THEN** o sistema exibe a página inicial do painel (imóveis)

#### Scenario: Navegar para as visitas
- **WHEN** um usuário staff, em qualquer página do painel, aciona o link "Visitas"
- **THEN** o sistema exibe a página de visitas do painel, com a seção de visitas indicada como ativa

## ADDED Requirements

### Requirement: Staff pode criar horários de visita para um imóvel
A página de visitas SHALL permitir ao usuário staff criar um horário de visita para um imóvel: informar o ID do imóvel, conferir o imóvel encontrado (título e endereço), informar data e hora e, opcionalmente, observações. Ao criar com sucesso, o sistema SHALL confirmar o horário criado exibindo o ID da visita, a data e hora e o status retornados pela API.

#### Scenario: Imóvel encontrado pelo ID
- **WHEN** um usuário staff informa o ID de um imóvel existente na seção de criar horário
- **THEN** o sistema exibe o título e o endereço do imóvel para conferência

#### Scenario: Imóvel não encontrado
- **WHEN** um usuário staff informa o ID de um imóvel que não existe
- **THEN** o sistema informa que o imóvel não foi encontrado e não permite criar o horário

#### Scenario: ID de imóvel inválido
- **WHEN** um usuário staff informa um valor que não é um número inteiro positivo
- **THEN** o sistema indica que o ID é inválido, sem buscar o imóvel

#### Scenario: Criar o horário com sucesso
- **WHEN** um usuário staff, com um imóvel encontrado, informa data e hora e confirma a criação
- **THEN** o sistema exibe a confirmação com o ID da visita, a data e hora e o status do horário criado

#### Scenario: Data e hora não informadas
- **WHEN** um usuário staff tenta criar o horário sem informar data e hora
- **THEN** o sistema impede o envio e indica que a data e hora são obrigatórias

#### Scenario: Criação recusada pela API
- **WHEN** a API recusa a criação do horário
- **THEN** o sistema exibe uma mensagem de erro em português e mantém os dados preenchidos

#### Scenario: Criação em andamento
- **WHEN** a criação do horário está sendo enviada
- **THEN** a ação de criar fica indisponível até a resposta chegar, evitando envios duplicados

### Requirement: Staff pode cancelar ou concluir uma visita pelo ID
A página de visitas SHALL permitir ao usuário staff informar o ID de uma visita e cancelá-la ou concluí-la. Ao executar com sucesso, o sistema SHALL exibir o resultado devolvido pela API (ID da visita, data e hora e novo status). Como a API não oferece consulta de visitas, o sistema SHALL NOT exibir dados da visita antes da ação.

#### Scenario: Cancelar uma visita
- **WHEN** um usuário staff informa o ID de uma visita e aciona "Cancelar visita"
- **THEN** o sistema exibe o resultado com o novo status retornado pela API

#### Scenario: Concluir uma visita
- **WHEN** um usuário staff informa o ID de uma visita e aciona "Concluir visita"
- **THEN** o sistema exibe o resultado com o novo status retornado pela API

#### Scenario: Visita não encontrada
- **WHEN** um usuário staff aciona cancelar ou concluir para um ID de visita que não existe
- **THEN** o sistema informa que a visita não foi encontrada

#### Scenario: Ação recusada pela API
- **WHEN** a API recusa o cancelamento ou a conclusão (ex.: status atual não permite)
- **THEN** o sistema exibe uma mensagem de erro em português indicando que a ação não pôde ser concluída

#### Scenario: ID de visita inválido
- **WHEN** um usuário staff aciona uma das ações com um valor que não é um número inteiro positivo
- **THEN** o sistema indica que o ID é inválido, sem enviar a ação

#### Scenario: Ação em andamento
- **WHEN** o cancelamento ou a conclusão está sendo enviado
- **THEN** os botões de ação ficam indisponíveis até a resposta chegar, evitando envios duplicados
