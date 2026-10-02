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

### Requirement: Painel lista os imóveis de todos os status com filtros
A página inicial do painel SHALL exibir a lista paginada (20 por página) de imóveis em qualquer status — rascunho, em análise, publicado, pausado, alugado, vendido ou removido —, mostrando para cada um: foto de capa (quando houver), título, endereço (bairro e cidade), status em português, data de cadastro e o corretor atribuído (ou a ausência dele), e SHALL oferecer para cada imóvel a ação de abrir seus detalhes. O painel SHALL permitir filtrar por status (abrindo em "Todos"), por corretor (incluindo "Sem corretor") e por busca de texto, SHALL permitir ordenar por mais novos (padrão) ou mais antigos, e SHALL exibir a contagem total.

#### Scenario: Lista de publicados carregada
- **WHEN** um usuário staff acessa a página inicial do painel
- **THEN** o painel exibe os imóveis de todos os status (inclusive os publicados), cada um com título, localização, status e corretor atribuído, e a contagem total

#### Scenario: Imóveis pausados aparecem na lista
- **WHEN** existem imóveis pausados
- **THEN** a lista os exibe, com o status "Pausado", sem ser preciso saber o ID

#### Scenario: Filtrar por status
- **WHEN** um usuário staff escolhe um status no filtro (ex.: "Pausado")
- **THEN** a lista exibe apenas imóveis com aquele status, voltando para a primeira página

#### Scenario: Filtrar por corretor
- **WHEN** um usuário staff escolhe um corretor no filtro
- **THEN** a lista exibe apenas os imóveis atribuídos àquele corretor

#### Scenario: Filtrar imóveis sem corretor
- **WHEN** um usuário staff escolhe "Sem corretor" no filtro de corretor
- **THEN** a lista exibe apenas os imóveis que não têm corretor atribuído

#### Scenario: Buscar por texto
- **WHEN** um usuário staff digita um texto na busca e confirma
- **THEN** a lista exibe apenas os imóveis que correspondem à busca, voltando para a primeira página

#### Scenario: Ordenar por mais antigos
- **WHEN** um usuário staff escolhe a ordenação "Mais antigos"
- **THEN** a lista passa a exibir os imóveis do cadastro mais antigo para o mais novo

#### Scenario: Navegar entre páginas
- **WHEN** há mais imóveis do que cabem em uma página e o usuário aciona outra página
- **THEN** a lista exibe os imóveis daquela página, mantendo os filtros

#### Scenario: Nenhum imóvel publicado
- **WHEN** nenhum imóvel atende aos filtros (ou não há imóveis)
- **THEN** o painel exibe uma mensagem informando que não há imóveis, em vez de uma área em branco

#### Scenario: Erro ao carregar a lista
- **WHEN** a busca dos imóveis falha
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

### Requirement: Staff gerencia a publicação de um imóvel pela lista
Cada imóvel da lista SHALL oferecer exatamente as ações de publicação que a API informa como permitidas naquele momento (aprovar, pausar, rejeitar e republicar), sem oferecer nenhuma outra e sem o painel decidir por conta própria quais valem para cada status. Pausar e rejeitar SHALL pedir confirmação antes de enviar; aprovar e republicar SHALL ser enviados direto. Ao pausar um imóvel cuja unidade tem visitas agendadas futuras, a confirmação SHALL avisar que as visitas continuam marcadas, mas que ninguém mais consegue reservar horários. Ao executar uma ação com sucesso, a lista SHALL refletir o novo status. Um imóvel pausado sem nenhuma ação permitida SHALL exibir a explicação de que a unidade já tem outro anúncio ativo. Se a API recusar a ação, o sistema SHALL exibir uma mensagem em português conforme o motivo, mantendo o status exibido até a lista ser atualizada. Enquanto uma ação está em andamento, as ações daquele imóvel SHALL ficar indisponíveis.

#### Scenario: Aprovar um imóvel
- **WHEN** um usuário staff aciona "Aprovar" em um imóvel em análise
- **THEN** o imóvel é publicado e a lista passa a exibir o novo status

#### Scenario: Pausar um imóvel
- **WHEN** um usuário staff aciona "Pausar" em um imóvel publicado e confirma
- **THEN** o imóvel é pausado e a lista passa a exibir o novo status

#### Scenario: Rejeitar um imóvel
- **WHEN** um usuário staff aciona "Rejeitar" em um imóvel em análise e confirma
- **THEN** o imóvel é removido e a lista passa a exibir o novo status

#### Scenario: Republicar um imóvel pausado
- **WHEN** um usuário staff aciona "Republicar" em um imóvel pausado
- **THEN** o imóvel volta a ser publicado e a lista passa a exibir o novo status

#### Scenario: Apenas as ações permitidas são oferecidas
- **WHEN** a API informa que um imóvel aceita apenas determinadas ações
- **THEN** a lista exibe um botão para cada ação informada e nenhum botão a mais

#### Scenario: Imóvel sem ações permitidas
- **WHEN** um imóvel não aceita nenhuma ação (ex.: removido)
- **THEN** a lista não exibe nenhuma ação de publicação para ele

#### Scenario: Imóvel pausado cuja unidade já tem outro anúncio ativo
- **WHEN** um imóvel pausado não aceita nenhuma ação
- **THEN** a lista exibe a explicação de que a unidade já tem outro anúncio ativo

#### Scenario: Desistir de pausar ou rejeitar
- **WHEN** um usuário staff aciona "Pausar" ou "Rejeitar" e recusa a confirmação
- **THEN** nada é enviado e o imóvel continua como estava

#### Scenario: Aviso de visitas agendadas ao pausar
- **WHEN** um usuário staff aciona "Pausar" em um imóvel cuja unidade tem visitas agendadas futuras
- **THEN** a confirmação informa quantas visitas há e que elas continuam marcadas, mas ninguém mais consegue reservar horários

#### Scenario: Pausar sem visitas agendadas
- **WHEN** um usuário staff aciona "Pausar" em um imóvel cuja unidade não tem visitas agendadas futuras
- **THEN** a confirmação não exibe o aviso de visitas

#### Scenario: Imóvel mudou de status
- **WHEN** a API recusa a ação porque o imóvel já mudou de status (outra pessoa da equipe agiu antes)
- **THEN** o sistema informa que o imóvel mudou de status e atualiza a lista

#### Scenario: Unidade já tem outro anúncio ativo ao republicar
- **WHEN** a API recusa "Republicar" porque a unidade já tem outro anúncio em análise ou publicado
- **THEN** o sistema informa que a unidade já tem outro anúncio ativo e mantém o imóvel pausado

#### Scenario: Ação recusada pela API
- **WHEN** a API recusa a ação por qualquer outro motivo (diferente dos dois casos acima)
- **THEN** o sistema exibe uma mensagem de erro em português e mantém o status exibido

#### Scenario: Ação em andamento
- **WHEN** uma ação de publicação está sendo enviada
- **THEN** as ações daquele imóvel ficam indisponíveis até a resposta chegar, evitando envios duplicados

### Requirement: Painel oferece navegação entre suas seções
Toda página do painel administrativo SHALL exibir uma navegação que permita ir para a seção de imóveis, para a seção de leads, para a seção de visitas e para a seção de corretores, indicando qual seção está ativa.

#### Scenario: Navegar do painel de imóveis para os leads
- **WHEN** um usuário staff, em qualquer página do painel, aciona o link "Leads"
- **THEN** o sistema exibe a página de leads do painel

#### Scenario: Voltar para imóveis
- **WHEN** um usuário staff, na página de leads, aciona o link "Imóveis"
- **THEN** o sistema exibe a página inicial do painel (imóveis)

#### Scenario: Navegar para as visitas
- **WHEN** um usuário staff, em qualquer página do painel, aciona o link "Visitas"
- **THEN** o sistema exibe a página de visitas do painel, com a seção de visitas indicada como ativa

#### Scenario: Navegar para os corretores
- **WHEN** um usuário staff, em qualquer página do painel, aciona o link "Corretores"
- **THEN** o sistema exibe a página de corretores do painel, com a seção de corretores indicada como ativa

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

### Requirement: Staff pode desativar ou reativar um corretor
Cada corretor na lista SHALL oferecer uma ação para desativar (se ativo) ou reativar (se inativo), sem pedir confirmação destrutiva, já que a ação não apaga o cadastro. Ao executar com sucesso, a lista SHALL refletir o novo estado do corretor.

#### Scenario: Desativar um corretor ativo
- **WHEN** um usuário staff aciona "Desativar" em um corretor ativo
- **THEN** o corretor passa a aparecer como inativo na lista

#### Scenario: Reativar um corretor inativo
- **WHEN** um usuário staff aciona "Reativar" em um corretor inativo
- **THEN** o corretor passa a aparecer como ativo na lista

#### Scenario: Ação recusada pela API
- **WHEN** a API recusa a desativação ou a reativação
- **THEN** o sistema exibe uma mensagem de erro em português e mantém o estado exibido como estava

#### Scenario: Ação em andamento
- **WHEN** a desativação ou a reativação está sendo enviada
- **THEN** a ação daquele corretor fica indisponível até a resposta chegar, evitando envios duplicados

### Requirement: Staff pode atribuir um corretor a um imóvel
A lista de imóveis e a tela de detalhe de um imóvel SHALL exibir o corretor atualmente atribuído a ele (quando houver) e SHALL oferecer um seletor, alimentado pelos corretores ativos, para atribuir um corretor ao imóvel ou trocar o corretor atribuído, além de uma ação para remover a atribuição atual. Ao atribuir ou remover com sucesso, a lista e o detalhe SHALL refletir o corretor atribuído (ou a ausência de um).

#### Scenario: Atribuir um corretor a um imóvel sem corretor
- **WHEN** um usuário staff, na lista ou no detalhe de um imóvel sem corretor atribuído, escolhe um corretor no seletor
- **THEN** o sistema atribui o corretor e a tela passa a exibi-lo como responsável pelo imóvel

#### Scenario: Trocar o corretor de um imóvel
- **WHEN** um usuário staff escolhe outro corretor no seletor de um imóvel que já tem corretor atribuído
- **THEN** o sistema substitui a atribuição, sem exigir que a anterior seja removida antes

#### Scenario: Remover a atribuição de um imóvel
- **WHEN** um usuário staff aciona remover atribuição em um imóvel com corretor
- **THEN** o sistema remove a atribuição e a tela deixa de exibir um corretor responsável

#### Scenario: Corretor inativo recusado
- **WHEN** a API recusa a atribuição porque o corretor escolhido está inativo
- **THEN** o sistema exibe uma mensagem informando que o corretor está inativo e precisa ser reativado antes de ser atribuído

#### Scenario: Atribuição em andamento
- **WHEN** uma atribuição ou remoção está sendo enviada
- **THEN** o seletor e a ação de remover ficam indisponíveis até a resposta chegar, evitando envios duplicados

#### Scenario: Atribuir pela lista reflete no detalhe
- **WHEN** um usuário staff atribui um corretor a um imóvel pela lista e depois abre o detalhe desse imóvel
- **THEN** o detalhe exibe o corretor atribuído

### Requirement: Staff pode atribuir um corretor a um lead
Cada lead na lista de leads SHALL exibir o corretor atualmente atribuído a ele (quando houver) e SHALL oferecer um seletor, alimentado pelos corretores ativos, para atribuir um corretor ao lead ou trocar o corretor atribuído, além de uma ação para remover a atribuição atual. Ao atribuir ou remover com sucesso, a lista SHALL refletir o corretor atribuído (ou a ausência de um) para aquele lead.

#### Scenario: Atribuir um corretor a um lead sem corretor
- **WHEN** um usuário staff, em um lead sem corretor atribuído, escolhe um corretor no seletor
- **THEN** o sistema atribui o corretor e a lista passa a exibi-lo naquele lead

#### Scenario: Trocar o corretor de um lead
- **WHEN** um usuário staff escolhe outro corretor no seletor de um lead que já tem corretor atribuído
- **THEN** o sistema substitui a atribuição, sem exigir que a anterior seja removida antes

#### Scenario: Remover a atribuição de um lead
- **WHEN** um usuário staff aciona remover atribuição em um lead com corretor
- **THEN** o sistema remove a atribuição e a lista deixa de exibir um corretor para aquele lead

#### Scenario: Corretor inativo recusado
- **WHEN** a API recusa a atribuição porque o corretor escolhido está inativo
- **THEN** o sistema exibe uma mensagem informando que o corretor está inativo e precisa ser reativado antes de ser atribuído

#### Scenario: Atribuição em andamento
- **WHEN** uma atribuição ou remoção está sendo enviada
- **THEN** o seletor e a ação de remover daquele lead ficam indisponíveis até a resposta chegar, evitando envios duplicados
### Requirement: Detalhe do imóvel no painel exibe dados e status sem ações de publicação
A tela de detalhe de um imóvel no painel SHALL exibir seus dados principais e seu status atual em português, o seletor de corretor e um link para a página pública do imóvel, e SHALL oferecer um link para voltar à lista de imóveis do painel, onde as ações de publicação são executadas. A tela de detalhe SHALL NOT oferecer as ações de aprovar, pausar, rejeitar ou republicar.

#### Scenario: Detalhe exibe dados e status
- **WHEN** um usuário staff abre o detalhe de um imóvel pelo ID
- **THEN** a tela exibe título, endereço e o status em português, independentemente do status do imóvel

#### Scenario: Detalhe sem ações de publicação
- **WHEN** um usuário staff abre o detalhe de um imóvel
- **THEN** a tela não oferece botões de aprovar, pausar, rejeitar ou republicar

#### Scenario: Voltar para a lista
- **WHEN** um usuário staff aciona o link para a lista de imóveis na tela de detalhe
- **THEN** o painel exibe a lista de imóveis
