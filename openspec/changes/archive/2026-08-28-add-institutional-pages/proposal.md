## Why

Os links "Alugar", "Comprar" e "Sobre" já existem no Header e no Footer, apontando pra `/alugar`, `/comprar` e `/sobre` — hoje todas 404. O design system já tem um mockup real e completo pra essas três páginas.

## What Changes

- Nova rota `/alugar`: landing educativa de aluguel, com busca dedicada, atalhos de filtro rápido, 2 imóveis reais em destaque (`disponivel_aluguel`) e conteúdo educativo "Antes de alugar".
- Nova rota `/comprar`: landing educativa de compra, com busca dedicada, CTA de simulação de financiamento via WhatsApp, 2 imóveis reais em destaque (`disponivel_venda`) e conteúdo educativo "Antes de comprar".
- Nova rota `/sobre`: página institucional com os diferenciais da Chaves e CTA final pra busca.
- Rotas do Footer sem mockup (Ajuda, Garantia, Gestão, Bairros, Trabalhe conosco) continuam fora de escopo — ficam 404 até terem um design de referência.

## Capabilities

### New Capabilities
- `institutional-pages`: as três páginas educativas/institucionais (`/alugar`, `/comprar`, `/sobre`).

## Impact

- Novo `src/app/alugar/page.tsx`, `src/app/comprar/page.tsx`, `src/app/sobre/page.tsx`, e componentes de suporte.
- Reaproveita `useImoveis`/`PropertyCard`/`toPropertyDisplayData` (imóveis reais em destaque), `buildWhatsappHref` (simulação de financiamento) e o padrão de formulário de busca já existente na Home.
- Nenhuma mudança em `Header.tsx`/`Footer.tsx` — os links já existem, só passam a resolver de verdade.
