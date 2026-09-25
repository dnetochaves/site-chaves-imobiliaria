## Purpose

Permite que o visitante autenticado acompanhe as visitas que agendou pelo site e cancele as que ainda estão agendadas.

## ADDED Requirements

### Requirement: Minhas visitas exige autenticação
O sistema SHALL exigir que o usuário esteja autenticado para ver a página "Minhas visitas" (`/minhas-visitas`). Um usuário não autenticado que acessa a rota SHALL ser levado a iniciar o login, em vez de ver a página, e SHALL voltar para essa página depois de entrar.

#### Scenario: Usuário autenticado acessa a página
- **WHEN** um usuário autenticado acessa `/minhas-visitas`
- **THEN** o sistema exibe a lista das suas visitas

#### Scenario: Usuário não autenticado acessa a página
- **WHEN** um usuário não autenticado acessa `/minhas-visitas`
- **THEN** o sistema inicia o fluxo de login, sem exibir a página, e o usuário volta para `/minhas-visitas` depois de entrar

### Requirement: Página lista as visitas do usuário
A página SHALL listar apenas as visitas do usuário autenticado, da mais recente para a mais antiga, com abas "Próximas" (visitas agendadas) e "Todas". Cada visita SHALL mostrar a data e hora (no horário de Salvador), o status em português (disponível, agendada, concluída ou cancelada) e o endereço. Quando o anúncio do imóvel ainda existe, a visita SHALL mostrar o título com um link para a página do imóvel; quando o anúncio não existe mais (pausado ou removido), SHALL mostrar apenas o endereço, sem link. A lista SHALL ser paginada quando houver mais visitas do que cabem em uma página.

#### Scenario: Visita com anúncio existente
- **WHEN** a lista contém uma visita cujo imóvel ainda tem anúncio
- **THEN** a visita mostra data e hora, status, endereço e o título do imóvel com link para a página dele

#### Scenario: Visita cujo anúncio não existe mais
- **WHEN** a lista contém uma visita cujo anúncio foi pausado ou removido
- **THEN** a visita mostra data e hora, status e endereço, sem link para o imóvel

#### Scenario: Aba Próximas
- **WHEN** o usuário está na aba "Próximas"
- **THEN** a lista mostra apenas as visitas agendadas

#### Scenario: Aba Todas
- **WHEN** o usuário aciona a aba "Todas"
- **THEN** a lista mostra visitas de todos os status

#### Scenario: Navegar entre páginas
- **WHEN** há mais visitas do que cabem em uma página e o usuário aciona outra página
- **THEN** a lista exibe as visitas daquela página, mantendo a aba escolhida

#### Scenario: Nenhuma visita
- **WHEN** o usuário não tem visitas na aba escolhida
- **THEN** a página informa que ainda não há visitas, em vez de uma área em branco

#### Scenario: Carregando e erro
- **WHEN** as visitas estão sendo buscadas, ou a busca falha
- **THEN** a página exibe um indicador de carregamento ou uma mensagem de erro, respectivamente, sem quebrar o restante da página

### Requirement: Usuário pode cancelar uma visita agendada
Cada visita com status "agendada" SHALL oferecer a ação "Cancelar visita", que SHALL pedir uma confirmação antes de enviar. Visitas em outros status SHALL NOT oferecer essa ação. Ao cancelar com sucesso, a lista SHALL refletir o novo status. Se a API recusar, o sistema SHALL exibir uma mensagem em português conforme o motivo (visita que não pode mais ser cancelada, visita que não é do usuário, visita não encontrada), mantendo o status como estava. Enquanto o cancelamento está em andamento, a confirmação SHALL ficar indisponível.

#### Scenario: Cancelar com confirmação
- **WHEN** o usuário aciona "Cancelar visita" e confirma
- **THEN** a visita é cancelada e a lista passa a mostrá-la como cancelada

#### Scenario: Desistir do cancelamento
- **WHEN** o usuário aciona "Cancelar visita" e recusa a confirmação
- **THEN** nada é enviado e a visita continua agendada

#### Scenario: Visita que não pode mais ser cancelada
- **WHEN** a API recusa o cancelamento porque a visita não está mais agendada
- **THEN** o sistema informa que a visita não pode mais ser cancelada e mantém o status exibido

#### Scenario: Visita de outro usuário
- **WHEN** a API recusa o cancelamento porque a visita não é do usuário
- **THEN** o sistema informa que o usuário não pode cancelar essa visita

#### Scenario: Visita não encontrada
- **WHEN** a API informa que a visita não existe
- **THEN** o sistema informa que a visita não foi encontrada

#### Scenario: Ação disponível só para visitas agendadas
- **WHEN** uma visita está concluída, cancelada ou disponível
- **THEN** ela não oferece a ação de cancelar
