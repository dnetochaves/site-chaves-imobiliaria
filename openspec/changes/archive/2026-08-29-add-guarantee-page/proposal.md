## Why

O link "Garantia" já existe na coluna "Proprietários" do Footer, apontando pra `/garantia` — hoje 404. É a primeira das páginas do Footer sem mockup a ser construída, uma de cada vez. Ao mesmo tempo, o link "Bairros" (coluna "Buscar") não faz sentido — decisão do usuário — e deve ser removido.

## What Changes

- Nova rota `/garantia`: página institucional sobre o produto de aluguel garantido (a Chaves garante o pagamento ao proprietário todo mês) — sem mockup no design system, conteúdo segue a voz já estabelecida no resto do site.
- Remove o link "Bairros" da coluna "Buscar" do Footer — não existe (nem está planejada) nenhuma página `/bairros`.

## Capabilities

### New Capabilities
- `guarantee-page`: página institucional sobre a garantia de aluguel oferecida a proprietários.

## Impact

- Novo `src/app/garantia/page.tsx`.
- `src/components/shell/Footer.tsx`: remove a entrada "Bairros" da coluna "Buscar" (mudança de conteúdo, sem impacto na spec `site-shell`, que não enumera links específicos).
- Reaproveita o padrão visual de 3 colunas de diferenciais + CTA já usado em `/sobre` (`add-institutional-pages`).
