# mobile-access Specification

## Purpose

Garante que o site inteiro, inclusive o painel administrativo, seja utilizável em telas de celular: sem rolagem horizontal, sem conteúdo cortado e com áreas de toque adequadas na navegação e nas ações principais.

## Requirements


### Requirement: Todas as páginas funcionam em telas estreitas
Todas as páginas do site SHALL ser utilizáveis em telas com largura de 375px e de 320px, sem rolagem horizontal da página e sem conteúdo cortado nas bordas. Isso SHALL valer para: a Home (`/`), `/alugar`, `/comprar`, `/busca`, a página de um imóvel (`/imoveis/{id}`), `/anunciar`, `/favoritos`, `/minhas-visitas`, `/ajuda`, `/sobre`, `/garantia`, `/trabalhe-conosco`, o painel administrativo (`/admin`, `/admin/imoveis/{id}`, `/admin/leads`, `/admin/visitas`) e a página de "página não encontrada". Conteúdo mais largo que a tela SHALL quebrar linha ou se reorganizar, e só pode rolar horizontalmente dentro de um elemento próprio (como um mapa), nunca a página inteira.

#### Scenario: Páginas públicas sem rolagem horizontal
- **WHEN** um usuário abre qualquer página pública listada em tela de 375px ou de 320px
- **THEN** a página não tem rolagem horizontal e nenhum texto ou ícone fica cortado na borda

#### Scenario: Páginas do painel sem rolagem horizontal
- **WHEN** um usuário staff abre qualquer página do painel administrativo em tela de 375px ou de 320px
- **THEN** a página não tem rolagem horizontal e nenhum texto ou controle fica cortado na borda

#### Scenario: Cards de imóvel em tela estreita
- **WHEN** um card de imóvel é exibido em tela de 375px ou de 320px
- **THEN** a linha de métricas (área, quartos, banheiros e vagas) quebra linha quando não cabe, sem ser cortada pela borda do card

#### Scenario: Página não encontrada em tela estreita
- **WHEN** um usuário abre uma rota inexistente em tela estreita
- **THEN** a página de "página não encontrada" é exibida sem rolagem horizontal, com o header e o menu funcionando

#### Scenario: Agendamento e Minhas visitas em tela estreita
- **WHEN** um usuário vê a seção de horários da página de um imóvel (com a lista de horários e o formulário de reserva abertos) ou a página Minhas visitas em tela de 375px ou de 320px
- **THEN** a página não tem rolagem horizontal e nenhum texto, horário ou botão fica cortado na borda

### Requirement: Navegação e ações principais têm área de toque adequada
Em telas estreitas, os elementos de navegação e as ações principais — links do header e do menu, ação de conta (entrar/sair), links do footer, o link "Ver todos" da Home, as abas de seção do painel administrativo, os botões de horário da seção de agendamento, as ações das visitas em Minhas visitas (abas, cancelar) e as ações de concluir e cancelar da lista de visitas do painel administrativo — SHALL ter área de toque de pelo menos 44px de altura. Em telas largas, o tamanho desses elementos SHALL permanecer como antes.

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
- **THEN** cada aba de seção (Imóveis, Leads, Visitas) tem pelo menos 44px de altura

#### Scenario: Desktop inalterado
- **WHEN** um usuário acessa o site em tela larga
- **THEN** o header, o footer e a navegação do painel mantêm o tamanho e a aparência que tinham antes desta mudança

#### Scenario: Horários e ações de visita com área de toque
- **WHEN** um usuário vê os horários da página de um imóvel ou as visitas em Minhas visitas em tela estreita
- **THEN** cada botão de horário, cada aba e o botão de cancelar visita têm pelo menos 44px de altura

#### Scenario: Ações da lista de visitas do painel com área de toque
- **WHEN** um usuário staff vê uma visita agendada na lista de visitas do painel em tela estreita
- **THEN** os botões "Concluir" e "Cancelar" têm pelo menos 44px de altura
