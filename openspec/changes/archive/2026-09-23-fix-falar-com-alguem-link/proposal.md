## Why

O botão "Falar com alguém" no bloco "Tem um imóvel para alugar?" da Home linka pra `/falar-com-alguem`, uma rota que nunca foi criada — em produção isso dá 404 (reportado pelo usuário em `https://www.chavesimobiliaria.imb.br/falar-com-alguem`).

## What Changes

- O botão "Falar com alguém" passa a abrir uma conversa de WhatsApp com uma mensagem pré-preenchida, em vez de navegar pra uma rota interna inexistente — mesmo padrão já usado em `/ajuda`.
- Spec `home-page` passa a declarar explicitamente que essa ação secundária abre um canal de contato externo (WhatsApp), fechando o gap que deixou esse link morto passar despercebido.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `home-page`: o requisito "CTAs institucionais são links visíveis" passa a especificar que a ação secundária do bloco de cadastro de imóvel ("Falar com alguém") abre WhatsApp, em vez de apenas dizer que é "clicável".

## Impact

- `src/app/_home/ListPropertyCta.tsx`.
- Fora de escopo: bloco de condomínios ("Pedir uma proposta" / "Como funciona"), não reportado como quebrado.
