## MODIFIED Requirements

### Requirement: Página lista as visitas do usuário
A página SHALL listar apenas as visitas do usuário autenticado, da mais recente para a mais antiga, com abas "Próximas" (visitas agendadas) e "Todas". Cada visita SHALL mostrar a data e hora (no horário de Salvador), o status em português (disponível, agendada, concluída ou cancelada) e a localização (bairro e cidade). O endereço completo (rua, número e complemento) SHALL ser exibido somente enquanto a visita está agendada e o imóvel tem endereço informado; visitas canceladas ou concluídas SHALL NOT exibir o endereço completo, e uma visita agendada de um imóvel sem endereço informado SHALL indicar que o endereço fica disponível após o agendamento. Quando o anúncio do imóvel ainda existe, a visita SHALL mostrar o título com um link para a página do imóvel; quando o anúncio não existe mais (pausado ou removido), SHALL mostrar apenas a localização, sem link. A lista SHALL ser paginada quando houver mais visitas do que cabem em uma página.

#### Scenario: Visita com anúncio existente
- **WHEN** a lista contém uma visita agendada cujo imóvel ainda tem anúncio e endereço informado
- **THEN** a visita mostra data e hora, status, bairro e cidade, o endereço completo e o título do imóvel com link para a página dele

#### Scenario: Visita cujo anúncio não existe mais
- **WHEN** a lista contém uma visita cujo anúncio foi pausado ou removido
- **THEN** a visita mostra data e hora, status e localização, sem link para o imóvel

#### Scenario: Visita cancelada ou concluída esconde o endereço completo
- **WHEN** a lista contém uma visita cancelada ou concluída
- **THEN** a visita mostra a localização (bairro e cidade), sem o endereço completo

#### Scenario: Visita agendada de imóvel sem endereço informado
- **WHEN** a lista contém uma visita agendada de um imóvel que não tem endereço informado
- **THEN** a visita indica que o endereço fica disponível após o agendamento

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
