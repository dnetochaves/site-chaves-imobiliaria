## Purpose

Oferece a cada corretor uma página pública de apresentação, acessível por um link estável, que funciona como cartão de visita digital: dados profissionais e ações de contato, sem exigir login.

## ADDED Requirements

### Requirement: Página pública exibe os dados do corretor
O sistema SHALL exibir, para um corretor identificado por slug na URL (`/corretores/{slug}`), uma página pública, acessível sem autenticação, com os dados retornados pela API: foto, nome, CRECI (número e UF), cidade/região e bio. Um campo não preenchido (`null`) SHALL ser omitido da página, sem texto substituto nem dado inventado.

#### Scenario: Corretor com todos os dados preenchidos
- **WHEN** um visitante acessa a página de um corretor cujo perfil tem foto, CRECI, cidade e bio preenchidos
- **THEN** a página exibe todos esses dados

#### Scenario: Corretor com dados parciais
- **WHEN** um visitante acessa a página de um corretor sem bio nem cidade preenchidas
- **THEN** a página exibe os demais dados normalmente, sem mostrar texto substituto para bio ou cidade

#### Scenario: Acesso sem autenticação
- **WHEN** um visitante sem sessão iniciada acessa a página de um corretor
- **THEN** a página carrega normalmente, sem exigir login

### Requirement: Corretor não encontrado
Quando a API responder 404 para o slug acessado — porque o slug nunca existiu ou porque o corretor está desativado —, o sistema SHALL exibir uma mensagem de "corretor não encontrado", sem distinguir os dois casos.

#### Scenario: Slug inexistente
- **WHEN** um visitante acessa `/corretores/{slug}` para um slug que nunca existiu
- **THEN** a página exibe que o corretor não foi encontrado

#### Scenario: Corretor desativado
- **WHEN** um visitante acessa o slug de um corretor que foi desativado
- **THEN** a página exibe a mesma mensagem de corretor não encontrado, sem indicar que o corretor já existiu

### Requirement: Ações de contato a partir do card público
A página pública SHALL oferecer, para cada dado de contato presente, uma ação correspondente: falar no WhatsApp (com mensagem inicial pré-preenchida) quando houver telefone, ligar (`tel:`) quando houver telefone, enviar e-mail (`mailto:`) quando houver e-mail, e links para Instagram e LinkedIn quando presentes em `redes_sociais`. Uma ação ausente por falta do dado correspondente SHALL NOT ser exibida.

#### Scenario: Corretor com telefone e e-mail
- **WHEN** a página de um corretor com telefone e e-mail preenchidos é exibida
- **THEN** a página oferece as ações de WhatsApp, ligar e enviar e-mail

#### Scenario: Mensagem pré-preenchida no WhatsApp
- **WHEN** um visitante aciona "Falar no WhatsApp" na página de um corretor
- **THEN** a conversa abre com o telefone do corretor e uma mensagem inicial já preenchida, mencionando o nome do corretor

#### Scenario: Corretor sem redes sociais
- **WHEN** a página de um corretor sem Instagram nem LinkedIn cadastrados é exibida
- **THEN** a página não exibe nenhuma dessas ações

### Requirement: Compartilhar a página do corretor
A página pública SHALL oferecer uma ação de compartilhar. Quando o navegador suportar a Web Share API, a ação SHALL abrir o menu de compartilhamento nativo com a URL da página. Quando não suportar, a ação SHALL copiar a URL da página para a área de transferência e confirmar visualmente que foi copiada.

#### Scenario: Compartilhar com Web Share API disponível
- **WHEN** um visitante aciona "Compartilhar" em um navegador que suporta a Web Share API
- **THEN** o menu nativo de compartilhamento do navegador abre com a URL da página do corretor

#### Scenario: Compartilhar sem Web Share API
- **WHEN** um visitante aciona "Compartilhar" em um navegador sem suporte à Web Share API
- **THEN** a URL da página é copiada para a área de transferência e a página confirma visualmente a cópia
