## MODIFIED Requirements

### Requirement: Navegação e ações principais têm área de toque adequada
Em telas estreitas, os elementos de navegação e as ações principais — links do header e do menu, ação de conta (entrar/sair), links do footer, o link "Ver todos" da Home, as abas de seção do painel administrativo, os botões de horário da seção de agendamento, as ações das visitas em Minhas visitas (abas, cancelar), as ações de concluir e cancelar da lista de visitas do painel administrativo, as ações de desativar/reativar da lista de corretores do painel administrativo, as ações de contato e compartilhar do card público do corretor e as ações de publicação (aprovar, pausar, rejeitar, republicar) da lista de imóveis do painel administrativo — SHALL ter área de toque de pelo menos 44px de altura. Em telas largas, o tamanho desses elementos SHALL permanecer como antes.

#### Scenario: Links do menu com área de toque
- **WHEN** o menu de navegação está aberto em tela estreita
- **THEN** cada link do menu tem pelo menos 44px de altura

#### Scenario: Ação de conta com área de toque
- **WHEN** um usuário vê o header em tela estreita
- **THEN** a ação de entrar ou sair tem pelo menos 44px de altura

#### Scenario: Links do footer com área de toque
- **WHEN** um usuário vê o footer em tela estreita
- **THEN** cada link do footer tem pelo menos 44px de altura

#### Scenario: Abas do painel com área de toque
- **WHEN** um usuário staff vê a navegação do painel administrativo em tela estreita
- **THEN** cada aba de seção (Imóveis, Leads, Visitas, Corretores) tem pelo menos 44px de altura

#### Scenario: Desktop inalterado
- **WHEN** um usuário acessa o site em tela larga
- **THEN** o header, o footer e a navegação do painel mantêm o tamanho e a aparência que tinham antes desta mudança

#### Scenario: Horários e ações de visita com área de toque
- **WHEN** um usuário vê os horários da página de um imóvel ou as visitas em Minhas visitas em tela estreita
- **THEN** cada botão de horário, cada aba e o botão de cancelar visita têm pelo menos 44px de altura

#### Scenario: Ações da lista de visitas do painel com área de toque
- **WHEN** um usuário staff vê uma visita agendada na lista de visitas do painel em tela estreita
- **THEN** os botões "Concluir" e "Cancelar" têm pelo menos 44px de altura

#### Scenario: Ações da lista de corretores com área de toque
- **WHEN** um usuário staff vê um corretor na lista de corretores do painel em tela estreita
- **THEN** o botão "Desativar" ou "Reativar" tem pelo menos 44px de altura

#### Scenario: Ações do card público do corretor com área de toque
- **WHEN** um visitante vê a página pública de um corretor em tela estreita
- **THEN** cada ação de contato (WhatsApp, ligar, e-mail, redes sociais) e a ação de compartilhar têm pelo menos 44px de altura

#### Scenario: Ações de publicação da lista de imóveis com área de toque
- **WHEN** um usuário staff vê a lista de imóveis do painel em tela estreita
- **THEN** cada botão de aprovar, pausar, rejeitar ou republicar tem pelo menos 44px de altura
