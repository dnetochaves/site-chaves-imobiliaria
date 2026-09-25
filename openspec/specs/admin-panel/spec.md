# admin-panel Specification

## Purpose

Oferece à equipe da Chaves (usuários staff) uma área administrativa dentro do site para moderar anúncios de imóveis, sem depender de chamadas diretas à API.

## Requirements

### Requirement: Painel administrativo é restrito a usuários staff
O sistema SHALL permitir o acesso às páginas do painel administrativo (`/admin` e subrotas) apenas a usuários autenticados com permissão de staff. Um usuário autenticado sem permissão de staff SHALL ver a mesma tela de "Página não encontrada" exibida para rotas inexistentes, sem qualquer indicação de que o painel existe. Um usuário não autenticado SHALL ser levado a iniciar o fluxo de login.

#### Scenario: Usuário staff acessa o painel
- **WHEN** um usuário autenticado com permissão de staff acessa `/admin`
- **THEN** o sistema exibe a página inicial do painel administrativo

#### Scenario: Usuário autenticado sem permissão de staff acessa o painel
- **WHEN** um usuário autenticado sem permissão de staff acessa `/admin` (ou qualquer subrota)
- **THEN** o sistema exibe "Página não encontrada", sem exibir nenhum conteúdo do painel

#### Scenario: Usuário não autenticado acessa o painel
- **WHEN** um usuário não autenticado acessa `/admin`
- **THEN** o sistema inicia o fluxo de login, sem exibir conteúdo do painel

#### Scenario: Estado da sessão ainda em verificação
- **WHEN** a sessão do usuário ainda está sendo validada ao acessar `/admin`
- **THEN** o sistema exibe um indicador de carregamento, sem exibir o painel nem "Página não encontrada" antes de saber se o usuário é staff

### Requirement: Painel lista os imóveis publicados
O painel SHALL exibir a lista de imóveis publicados, com título, localização e status de cada um, e SHALL oferecer para cada imóvel a ação de abrir seus detalhes de moderação.

#### Scenario: Lista de publicados carregada
- **WHEN** um usuário staff acessa a página inicial do painel
- **THEN** o painel exibe os imóveis publicados, cada um com título, localização e status

#### Scenario: Nenhum imóvel publicado
- **WHEN** não há imóveis publicados
- **THEN** o painel exibe uma mensagem informando que não há imóveis, em vez de uma área em branco

#### Scenario: Erro ao carregar a lista
- **WHEN** a busca dos imóveis publicados falha
- **THEN** o painel exibe uma mensagem de erro, sem quebrar o restante da página

### Requirement: Painel permite abrir um imóvel pelo ID
O painel SHALL oferecer um campo para informar o ID de um imóvel e abrir sua tela de moderação, independente do status do imóvel (inclusive não publicados).

#### Scenario: Abrir imóvel existente por ID
- **WHEN** um usuário staff informa o ID de um imóvel existente e confirma
- **THEN** o sistema exibe a tela de moderação daquele imóvel com seus dados e status atual

#### Scenario: Abrir imóvel inexistente por ID
- **WHEN** um usuário staff informa o ID de um imóvel que não existe
- **THEN** o sistema informa que o imóvel não foi encontrado

#### Scenario: ID inválido
- **WHEN** um usuário staff tenta abrir um imóvel com um valor que não é um número inteiro positivo
- **THEN** o sistema não navega e indica que o ID é inválido

### Requirement: Staff pode aprovar, pausar ou rejeitar um imóvel
A tela de moderação de um imóvel SHALL exibir seus dados principais e seu status atual, e SHALL oferecer as ações de aprovar, pausar e rejeitar. Ao executar uma ação com sucesso, a tela SHALL refletir o novo status do imóvel. Se a API recusar a ação (ex.: transição de status não permitida), o sistema SHALL exibir uma mensagem de erro em português indicando que a ação não pôde ser concluída e que pode não ser permitida para o status atual do imóvel, mantendo o status exibido inalterado.

#### Scenario: Aprovar um imóvel
- **WHEN** um usuário staff aciona "Aprovar" na tela de moderação de um imóvel
- **THEN** o sistema envia a aprovação e a tela passa a exibir o novo status retornado pela API

#### Scenario: Pausar um imóvel
- **WHEN** um usuário staff aciona "Pausar" na tela de moderação de um imóvel
- **THEN** o sistema envia a pausa e a tela passa a exibir o novo status retornado pela API

#### Scenario: Rejeitar um imóvel
- **WHEN** um usuário staff aciona "Rejeitar" na tela de moderação de um imóvel
- **THEN** o sistema envia a rejeição e a tela passa a exibir o novo status retornado pela API

#### Scenario: Ação recusada pela API
- **WHEN** a API recusa uma ação de moderação (ex.: transição de status inválida)
- **THEN** o sistema exibe uma mensagem de erro em português indicando que a ação não pôde ser concluída e mantém o status exibido como estava

#### Scenario: Ação em andamento
- **WHEN** uma ação de moderação está sendo enviada
- **THEN** os botões de ação ficam indisponíveis até a resposta chegar, evitando envios duplicados

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

### Requirement: Painel lista os leads com filtros
O painel SHALL exibir a lista paginada de leads, mostrando para cada um: nome, telefone, tipo, status, contexto (quando houver) e o número da unidade relacionada (quando houver). O painel SHALL permitir filtrar a lista por status e por tipo, e SHALL exibir a contagem total de leads que atendem aos filtros.

#### Scenario: Lista de leads carregada
- **WHEN** um usuário staff acessa a página de leads
- **THEN** o painel exibe os leads com nome, telefone, tipo e status, e a contagem total

#### Scenario: Filtrar por status
- **WHEN** um usuário staff seleciona um status no filtro (ex.: "Novo")
- **THEN** a lista é atualizada para exibir apenas leads com aquele status, voltando para a primeira página

#### Scenario: Filtrar por tipo
- **WHEN** um usuário staff seleciona um tipo no filtro (ex.: "Contato sobre imóvel")
- **THEN** a lista é atualizada para exibir apenas leads daquele tipo, voltando para a primeira página

#### Scenario: Remover um filtro
- **WHEN** um usuário staff volta um filtro para "Todos"
- **THEN** a lista é atualizada sem aquele critério

#### Scenario: Navegar entre páginas de leads
- **WHEN** há mais leads do que cabem em uma página e o usuário staff aciona outra página
- **THEN** a lista exibe os leads daquela página, mantendo os filtros ativos

#### Scenario: Nenhum lead encontrado
- **WHEN** nenhum lead atende aos filtros (ou não há leads)
- **THEN** o painel exibe uma mensagem informando que não há leads, em vez de uma área em branco

#### Scenario: Erro ao carregar os leads
- **WHEN** a busca dos leads falha
- **THEN** o painel exibe uma mensagem de erro, sem quebrar o restante da página

### Requirement: Staff pode alterar o status de um lead
Cada lead na lista SHALL permitir ao usuário staff escolher um novo status entre novo, em atendimento, concluído e perdido. Ao concluir com sucesso, a lista SHALL refletir o novo status do lead. Se a API recusar a mudança (ex.: transição não permitida), o sistema SHALL exibir uma mensagem de erro em português indicando que o status não pôde ser alterado, mantendo o status exibido inalterado.

#### Scenario: Alterar o status com sucesso
- **WHEN** um usuário staff escolhe um novo status para um lead e a API aceita a mudança
- **THEN** a lista passa a exibir o novo status desse lead

#### Scenario: Mudança recusada pela API
- **WHEN** a API recusa a mudança de status (ex.: transição não permitida)
- **THEN** o sistema exibe uma mensagem de erro em português e mantém o status exibido como estava

#### Scenario: Mudança em andamento
- **WHEN** a mudança de status de um lead está sendo enviada
- **THEN** o controle de status desse lead fica indisponível até a resposta chegar, evitando envios duplicados

### Requirement: Staff pode abrir uma conversa de WhatsApp com o lead
Cada lead cujo telefone contém dígitos suficientes para formar um número válido SHALL oferecer uma ação que abre, em nova aba, uma conversa de WhatsApp com o telefone informado pelo lead. Quando o telefone não permitir formar um número válido, o painel SHALL NOT exibir essa ação, sem esconder o telefone em si.

#### Scenario: Abrir WhatsApp de um lead com telefone válido
- **WHEN** um usuário staff aciona o atalho de WhatsApp de um lead com telefone válido
- **THEN** o sistema abre uma conversa de WhatsApp com o telefone daquele lead em uma nova aba

#### Scenario: Lead com telefone inutilizável
- **WHEN** o telefone de um lead não tem dígitos suficientes para formar um número válido
- **THEN** o painel exibe o telefone como foi informado, sem o atalho de WhatsApp

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
