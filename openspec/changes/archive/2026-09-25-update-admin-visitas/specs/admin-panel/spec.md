## MODIFIED Requirements

### Requirement: Staff pode criar horários de visita para um imóvel
A página de visitas SHALL permitir ao usuário staff criar um horário de visita para um imóvel: informar o ID do imóvel, conferir o imóvel encontrado (título e endereço), informar data e hora e, opcionalmente, observações. A data e a hora informadas SHALL ser interpretadas como horário de Salvador, independentemente do fuso do navegador, e a tela SHALL indicar isso. Ao criar com sucesso, o sistema SHALL confirmar o horário criado exibindo o ID da visita, a data e hora (no horário de Salvador) e o status retornados pela API, e SHALL atualizar a lista de visitas.

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

#### Scenario: Data e hora interpretadas como horário de Salvador
- **WHEN** um usuário staff informa 05/10/2026 às 14:30 e confirma, com o navegador em qualquer fuso
- **THEN** o horário criado corresponde a 14:30 em Salvador (17:30 UTC) e a confirmação o exibe como 14:30

#### Scenario: Aviso do horário de Salvador
- **WHEN** um usuário staff vê o formulário de criação de horário
- **THEN** a tela indica que a data e a hora são em horário de Salvador

#### Scenario: Novo horário aparece na lista
- **WHEN** um horário é criado com sucesso
- **THEN** a lista de visitas é atualizada e o novo horário passa a aparecer quando o filtro de status o inclui

## ADDED Requirements

### Requirement: Painel lista as visitas com filtros
A página de visitas SHALL exibir a lista paginada de visitas (20 por página), mostrando para cada uma: data e hora (no horário de Salvador), status em português (disponível, agendada, concluída ou cancelada), o imóvel (título, com link para a tela de moderação do imóvel quando o anúncio existe; apenas o endereço quando não existe), o endereço, os dados de quem reservou (nome ou e-mail, e-mail, telefone e observações do visitante) quando houver reserva, e a nota interna da equipe quando houver, rotulada separadamente das observações do visitante. A lista SHALL ser exibida na ordem recebida da API. O painel SHALL permitir filtrar por status (abrindo em "Agendadas"; também Todas, Disponíveis, Concluídas e Canceladas), por ID do imóvel e por período (de e até, em horário de Salvador), e SHALL exibir a contagem total.

#### Scenario: Lista aberta em Agendadas
- **WHEN** um usuário staff abre a página de visitas
- **THEN** o filtro de status está em "Agendadas" e a lista mostra apenas visitas agendadas

#### Scenario: Visita agendada com dados do visitante
- **WHEN** a lista contém uma visita agendada
- **THEN** a visita mostra data e hora, status, imóvel, endereço, o nome ou e-mail do visitante, seu e-mail, telefone e observações, e a nota da equipe quando houver

#### Scenario: Horário livre sem visitante
- **WHEN** a lista contém um horário disponível, ainda sem reserva
- **THEN** a visita mostra data e hora, status e imóvel, sem dados de visitante

#### Scenario: Visita sem anúncio publicado
- **WHEN** a lista contém uma visita cujo imóvel não tem mais anúncio publicado
- **THEN** a visita mostra o endereço, sem link para a moderação de imóvel

#### Scenario: Filtrar por status
- **WHEN** um usuário staff escolhe um status (ex.: "Concluídas") ou "Todas"
- **THEN** a lista é atualizada e volta para a primeira página

#### Scenario: Filtrar por imóvel
- **WHEN** um usuário staff informa o ID de um imóvel no filtro
- **THEN** a lista mostra apenas visitas daquele imóvel, e um ID de imóvel inexistente resulta em lista vazia, sem erro

#### Scenario: ID de imóvel inválido no filtro
- **WHEN** um usuário staff informa no filtro um valor que não é um número inteiro positivo
- **THEN** o sistema indica que o ID é inválido e não atualiza a lista

#### Scenario: Filtrar por período
- **WHEN** um usuário staff informa uma data inicial e/ou final
- **THEN** a lista mostra apenas visitas cujo horário está dentro do período, do início do dia inicial ao fim do dia final, em horário de Salvador

#### Scenario: Navegar entre páginas
- **WHEN** há mais visitas do que cabem em uma página e o usuário aciona outra página
- **THEN** a lista exibe as visitas daquela página, mantendo os filtros

#### Scenario: Nenhuma visita encontrada
- **WHEN** nenhuma visita atende aos filtros
- **THEN** a página informa que não há visitas, em vez de uma área em branco

#### Scenario: Carregando e erro
- **WHEN** as visitas estão sendo buscadas, ou a busca falha
- **THEN** a página exibe um indicador de carregamento ou uma mensagem de erro, respectivamente, sem quebrar o restante da página

### Requirement: Staff pode cancelar ou concluir uma visita pela lista
Cada visita agendada na lista SHALL oferecer as ações "Concluir" e "Cancelar", cada uma com uma confirmação antes de enviar. Visitas em outros status SHALL NOT oferecer essas ações. Ao executar com sucesso, a lista SHALL refletir o novo status. Se a API recusar a ação, o sistema SHALL exibir uma mensagem em português conforme o motivo (visita que não pode ser alterada no estado atual, sem permissão, visita não encontrada, sessão expirada), mantendo o status como estava. Enquanto a ação está em andamento, os botões da confirmação SHALL ficar indisponíveis.

#### Scenario: Concluir uma visita agendada
- **WHEN** um usuário staff aciona "Concluir" em uma visita agendada e confirma
- **THEN** a visita é concluída e a lista passa a refletir o novo status

#### Scenario: Cancelar uma visita agendada
- **WHEN** um usuário staff aciona "Cancelar" em uma visita agendada e confirma
- **THEN** a visita é cancelada e a lista passa a refletir o novo status

#### Scenario: Desistir da ação
- **WHEN** um usuário staff aciona uma ação e recusa a confirmação
- **THEN** nada é enviado e a visita continua como estava

#### Scenario: Ação recusada pela API
- **WHEN** a API recusa a ação porque a visita não pode ser alterada no estado atual
- **THEN** o sistema exibe uma mensagem de erro em português e mantém o status exibido

#### Scenario: Visita não encontrada
- **WHEN** a API informa que a visita não existe
- **THEN** o sistema informa que a visita não foi encontrada

#### Scenario: Ações só para visitas agendadas
- **WHEN** uma visita está disponível, concluída ou cancelada
- **THEN** ela não oferece as ações de concluir e cancelar

#### Scenario: Ação em andamento
- **WHEN** a conclusão ou o cancelamento está sendo enviado
- **THEN** os botões da confirmação ficam indisponíveis até a resposta chegar, evitando envios duplicados

## REMOVED Requirements

### Requirement: Staff pode cancelar ou concluir uma visita pelo ID
**Reason**: A API passou a oferecer a listagem de visitas, então a equipe age diretamente na lista, com os dados de quem reservou, sem precisar conhecer o ID da visita.
**Migration**: Use as ações "Concluir" e "Cancelar" de cada visita agendada na lista de visitas da página `/admin/visitas`.
