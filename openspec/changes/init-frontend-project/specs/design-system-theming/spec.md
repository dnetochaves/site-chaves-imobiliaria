## Purpose

Garante que os tokens visuais e os componentes de base definidos no Design System (marca, cores, tipografia, espaçamento e estados de interação) fiquem disponíveis de forma consistente para toda a aplicação, em vez de valores fixos espalhados pelo código.

## ADDED Requirements

### Requirement: Tokens de cor da marca disponíveis como tema
O sistema SHALL expor as cores de marca e suas escalas (Petróleo, Areia, Cal, e as escalas semânticas de texto/borda/feedback definidas no Design System) como valores de tema reutilizáveis, em vez de códigos hexadecimais fixos no código de componentes.

#### Scenario: Uso de cor de marca em um componente
- **WHEN** um componente precisa aplicar a cor primária da marca
- **THEN** o componente referencia um token de tema (não um valor hexadecimal literal) e o valor resultante corresponde à cor Petróleo `#0D4650` definida no Design System

### Requirement: Escala tipográfica consistente
O sistema SHALL expor a escala tipográfica (tamanhos, pesos e alturas de linha definidos no Design System, de `text-xs` a `text-6xl`) como tokens de tema utilizáveis por qualquer componente.

#### Scenario: Aplicação de um título de página
- **WHEN** um componente de título usa o token de tamanho `text-4xl`
- **THEN** o texto renderizado usa o tamanho, peso e altura de linha especificados no Design System para `text-4xl`

### Requirement: Escala de espaçamento, raio e sombra consistente
O sistema SHALL expor as escalas de spacing (base 4), radius, shadow, motion (durações e easings), breakpoints e z-index do Design System como tokens de tema, reutilizáveis em qualquer componente.

#### Scenario: Espaçamento entre elementos
- **WHEN** um componente aplica espaçamento usando um token de spacing
- **THEN** o valor resultante corresponde a um dos valores da escala definida no Design System (ex.: 4px, 8px, 12px...)

### Requirement: Estados de interação dos componentes base
Os componentes de UI base (botões, inputs, controles) SHALL suportar visualmente os estados definidos no Design System: default, hover, active, focus, disabled e loading.

#### Scenario: Botão em estado de foco
- **WHEN** um usuário navega até um botão via teclado
- **THEN** o botão exibe um indicador de foco visível consistente com o token `border.focus` do Design System

#### Scenario: Botão em estado de carregamento
- **WHEN** um botão está em estado de loading
- **THEN** o botão exibe um indicador de carregamento e impede novos cliques até que o estado mude

### Requirement: Acessibilidade dos componentes base
Os componentes de UI base SHALL atender aos requisitos de acessibilidade especificados no Design System, incluindo contraste mínimo de texto e atributos ARIA apropriados (ex.: `aria-pressed` em controles de seleção).

#### Scenario: Contraste de texto padrão
- **WHEN** um texto usa o token `text.primary` sobre o fundo `background.default`
- **THEN** a razão de contraste resultante é igual ou superior à especificada no Design System (14.4:1)
