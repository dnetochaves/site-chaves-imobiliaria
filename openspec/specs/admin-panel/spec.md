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
