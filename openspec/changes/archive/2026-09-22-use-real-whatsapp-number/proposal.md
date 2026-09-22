## Why

Todo contato via WhatsApp do site (Home, `/comprar`, detalhe do imóvel, `/trabalhe-conosco`) aponta hoje para um número placeholder (`5511999999999`, marcado com um TODO no código) em vez do número real da Chaves Imobiliária (`+55 71 98391-7864`). Nenhuma mensagem enviada por esses botões chega à imobiliária de verdade.

## What Changes

- `src/lib/whatsapp.ts`: o número placeholder é substituído pelo número real, e a constante deixa de se chamar/comentar como placeholder.

## Capabilities

Sem mudança de comportamento especificado: os fluxos que abrem WhatsApp (Home, `/comprar`, detalhe do imóvel, `/trabalhe-conosco`) continuam exatamente os mesmos, com o mesmo destino "uma conversa de WhatsApp" que as specs já descrevem — só o número de destino passa de um placeholder inexistente para o número real. `skip_specs: true` (mesmo padrão usado em `switch-map-tile-provider`).

## Impact

- `src/lib/whatsapp.ts`: único arquivo alterado — é a única fonte do número em todo o projeto (confirmado via busca no código).
- Nenhum outro arquivo muda: `PropertyPriceSidebar.tsx`, `comprar/page.tsx`, `CategoryShortcuts.tsx` e `trabalhe-conosco/page.tsx` só consomem `buildWhatsappHref`, sem número próprio.
