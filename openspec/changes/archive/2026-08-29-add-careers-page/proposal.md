## Why

O link "Trabalhe conosco" já existe na coluna "Chaves" do Footer, apontando pra `/trabalhe-conosco` — hoje 404. É a segunda das páginas do Footer sem mockup a ser construída, depois de `/garantia` (`add-guarantee-page`). A página não é uma vaga de emprego CLT genérica — é voltada especificamente a corretores de imóveis que queiram ser parceiros da Chaves (vendendo/alugando os imóveis da Chaves, atuando na administração/gestão de condomínios, ou outro formato de parceria).

## What Changes

- Nova rota `/trabalhe-conosco`: página institucional voltada a corretores parceiros, cobrindo os formatos de parceria já confirmados (venda/locação dos imóveis da Chaves, administração/gestão de condomínios), sem inventar um processo seletivo estruturado que não existe, com uma ação de contato via WhatsApp pra iniciar a conversa.

## Capabilities

### New Capabilities
- `careers-page`: página institucional "Trabalhe conosco", voltada a corretores parceiros, com contato via WhatsApp.

## Impact

- Novo `src/app/trabalhe-conosco/page.tsx`.
- Reaproveita `buildWhatsappHref` (`src/lib/whatsapp.ts`) e o padrão visual de página institucional simples já estabelecido em `/garantia`/`/sobre`.
- Nenhuma mudança em `Header.tsx`/`Footer.tsx` — o link já existe, só passa a resolver de verdade.
