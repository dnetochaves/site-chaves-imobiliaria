## Why

No celular, o header do site esconde toda a navegação (Alugar, Comprar, Anunciar, Ajuda, Favoritos e Admin) e não existe menu alternativo — só ficam a logo e "Entrar"/"Sair". Foi assim que o link do painel administrativo "sumiu" para quem acessou pelo celular, mas o problema é do site inteiro: ninguém alcança as páginas principais pelo header numa tela pequena. Não há hoje nenhuma exigência (spec) de que o site funcione no celular.

## What Changes

- Auditoria feita em tela de 375px, em todas as rotas do site (públicas e do painel), com estes achados:
  - **Crítico:** navegação inteira do header invisível abaixo de 768px, sem menu mobile.
  - Nenhuma rota tem rolagem horizontal da página; a única exceção de layout é a linha de métricas dos cards em `/alugar` e `/comprar`, que passa da borda e fica cortada.
  - Alvos de toque pequenos: links do footer (~18px de altura), "Sair" (28px), "Ver todos →" da Home (~21px) e abas do painel (31px).
- Correções:
  - Botão de menu (hambúrguer) no header em telas estreitas, abrindo um painel abaixo do header com os mesmos links do desktop, respeitando as mesmas regras de quem vê Favoritos (autenticado) e Admin (staff).
  - Área de toque de pelo menos 44px de altura nos links do header/menu, do footer, na ação de conta, no "Ver todos →" e nas abas do painel, somente em telas estreitas (o visual no desktop não muda).
  - Linha de métricas do card passa a quebrar linha em vez de ser cortada.
- Nova spec transversal `mobile-access` que passa a exigir, e permite verificar, o funcionamento de todas as páginas em telas estreitas (375px e 320px), com a lista das rotas.
- Achado documentado e fora desta change: controles de filtro da busca e de formulários têm ~32px de altura.

## Capabilities

### New Capabilities

- `mobile-access`: requisitos transversais de uso em telas estreitas — todas as páginas sem rolagem horizontal e sem conteúdo cortado; alvos de toque mínimos na navegação e nas ações principais.

### Modified Capabilities

- `site-shell`: novo requisito (ADDED) para o menu de navegação do header em telas pequenas; os requisitos existentes não mudam.

## Impact

- `src/components/shell/Header.tsx` (menu mobile e altura de toque), `src/components/shell/Footer.tsx`, `src/app/admin/layout.tsx`, `src/components/property/PropertyCard.tsx`, e o link "Ver todos →" da Home.
- Sem mudanças de API nem de backend.
- Fora de escopo: filtros da busca e formulários, drawer lateral, PWA, redesign visual, testes em aparelho real, tablet além de manter o comportamento atual.
