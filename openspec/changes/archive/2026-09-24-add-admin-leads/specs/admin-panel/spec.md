## ADDED Requirements

### Requirement: Painel oferece navegação entre suas seções
Toda página do painel administrativo SHALL exibir uma navegação que permita ir para a seção de imóveis e para a seção de leads, indicando qual seção está ativa.

#### Scenario: Navegar do painel de imóveis para os leads
- **WHEN** um usuário staff, em qualquer página do painel, aciona o link "Leads"
- **THEN** o sistema exibe a página de leads do painel

#### Scenario: Voltar para imóveis
- **WHEN** um usuário staff, na página de leads, aciona o link "Imóveis"
- **THEN** o sistema exibe a página inicial do painel (imóveis)

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
