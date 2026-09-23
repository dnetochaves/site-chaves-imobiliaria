## MODIFIED Requirements

### Requirement: CTAs institucionais são links visíveis
A Home SHALL exibir um bloco de CTA para o serviço de gestão de condomínios e um bloco de CTA para cadastro de imóvel para aluguel. Cada bloco SHALL exibir pelo menos dois elementos clicáveis (uma ação primária e uma ação secundária). O bloco de condomínios SHALL também exibir um resumo ilustrativo de dados de prestação de contas de um condomínio de exemplo. No bloco de cadastro de imóvel, a ação secundária ("Falar com alguém") SHALL abrir um canal de contato externo (ex.: WhatsApp) em vez de navegar para uma rota interna.

#### Scenario: CTA de condomínios visível
- **WHEN** um usuário acessa a Home
- **THEN** o bloco "Administramos o seu condomínio" está visível com uma ação primária (ex.: "Pedir uma proposta") e uma ação secundária (ex.: "Como funciona"), ambas clicáveis

#### Scenario: Resumo ilustrativo de condomínio visível
- **WHEN** um usuário acessa a Home
- **THEN** o bloco de condomínios exibe um resumo com nome do condomínio de exemplo e métricas de prestação de contas (arrecadado, despesas, inadimplência, fundo de reserva)

#### Scenario: CTA de cadastro de imóvel visível
- **WHEN** um usuário acessa a Home
- **THEN** o bloco "Tem um imóvel para alugar?" está visível com uma ação primária (ex.: "Anunciar imóvel") e uma ação secundária (ex.: "Falar com alguém"), ambas clicáveis

#### Scenario: Clicar em "Falar com alguém" abre o WhatsApp
- **WHEN** um usuário clica na ação secundária "Falar com alguém" do bloco "Tem um imóvel para alugar?"
- **THEN** o sistema abre uma conversa de WhatsApp com uma mensagem pré-preenchida, em vez de navegar para uma rota interna
