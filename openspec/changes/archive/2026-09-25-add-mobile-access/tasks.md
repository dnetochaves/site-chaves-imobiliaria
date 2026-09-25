## 1. Menu mobile no header

- [x] 1.1 Em `src/components/shell/Header.tsx`, montar uma única lista de itens de navegação (principais + Favoritos se autenticado + Admin se staff) e usá-la no nav desktop (`hidden md:flex`, sem mudança visual) e no menu mobile; verificar `tsc`/`eslint` limpos
- [x] 1.2 Adicionar o botão de menu (`md:hidden`, ícones `Menu`/`X`, `aria-expanded`, `aria-controls`, `aria-label` "Abrir menu"/"Fechar menu") e o painel mobile abaixo da barra com o nome do usuário (quando autenticado) e os links; fechar ao acionar um link, ao mudar de rota, ao acionar o botão e com Esc
- [x] 1.3 Manter Entrar/Sair visíveis no header mobile; verificar que a barra (logo + conta + botão) cabe em 375px e 320px

## 2. Áreas de toque de 44px (só no mobile)

- [x] 2.1 Header: links do menu com `min-h-11`, botão de menu `size-11` e Entrar/Sair `h-11 md:h-7`
- [x] 2.2 Footer: links `inline-flex min-h-11 items-center md:min-h-0`, ajustando o espaçamento da lista para o desktop não crescer; conferir se `grid-cols-3` cabe em 375px/320px e, se não couber, usar coluna única no mobile
- [x] 2.3 Home: link "Ver todos →" com `inline-flex min-h-11 items-center md:min-h-0`
- [x] 2.4 Painel: abas de seção em `src/app/admin/layout.tsx` com 44px de altura no mobile, mantendo a borda de destaque da aba ativa

## 3. Card de imóvel

- [x] 3.1 Em `PropertyCard.tsx`, a linha de métricas com `flex-wrap gap-x-4 gap-y-1`, verificando em 375px e 320px que nada é cortado em `/alugar` e `/comprar` e que o desktop não mudou

## 4. Verificação em todo o site

- [x] 4.1 Recriar um proxy local mínimo de teste (Node: `/auth/me` para `staff-token`/`user-token`, resto GET repassado à produção), apontar `.env.local` para ele e subir o servidor de desenvolvimento
- [x] 4.2 Matriz de rotas em 375px e 320px (`/`, `/alugar`, `/comprar`, `/busca`, `/imoveis/{id}`, `/anunciar`, `/favoritos`, `/ajuda`, `/sobre`, `/garantia`, `/trabalhe-conosco`, `/admin`, `/admin/imoveis/{id}`, `/admin/leads`, `/admin/visitas` e uma rota inexistente): `scrollWidth <= innerWidth`, nenhum elemento com borda além da largura (fora de contêineres com rolagem própria) e screenshot das rotas com achados
- [x] 4.3 Menu nos três perfis (não logado, autenticado sem staff, staff): abrir/fechar, fechar ao navegar, fechar com Esc, conteúdo correto (Favoritos só autenticado, Admin só staff), rótulos acessíveis e `aria-expanded`
- [x] 4.4 Alturas de toque: links do menu, Entrar/Sair, links do footer, "Ver todos →" e abas do painel com pelo menos 44px em 375px e 320px
- [x] 4.5 Desktop (≥768px) sem mudança: header com nav horizontal e sem botão de menu, footer e abas do painel com o tamanho anterior
- [x] 4.6 Restaurar `.env.local`, parar proxy e servidor, voltar o viewport para desktop; `tsc` e `eslint` limpos no projeto todo; registrar no relatório o que só o usuário confirma num aparelho real (toque, teclado virtual, safe-area) e os achados fora de escopo (controles de filtro e formulários ~32px)
