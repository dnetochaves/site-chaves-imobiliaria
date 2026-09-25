## Context

`src/components/shell/Header.tsx` esconde abaixo de 768px (`hidden ... md:flex` / `md:inline`) a navegação principal, o link Favoritos, o link Admin e o nome do usuário, sem alternativa; em telas estreitas restam logo e "Entrar"/"Sair". A auditoria em 375px (ver proposal.md) mostrou que nenhuma rota tem rolagem horizontal da página; os problemas são o menu ausente, a linha de métricas do card cortada e alvos de toque pequenos (footer ~18px, "Sair" 28px, "Ver todos" ~21px, abas do painel 31px). O `Button` do projeto tem `default` h-8, `sm` h-7, `lg` h-9. O footer usa `grid grid-cols-3` e a coluna da marca vem antes.

## Goals / Non-Goals

**Goals:**
- Toda a navegação (incluindo Favoritos e Admin) alcançável no celular, sem duplicar as regras de quem vê o quê.
- Alvos de toque de 44px na navegação e ações principais, sem mudar o desktop.
- Uma spec verificável, e uma matriz de verificação que cobre todas as rotas em 375px e 320px.

**Non-Goals:**
- Filtros da busca e controles de formulário (~32px): achado documentado, fora do escopo.
- Drawer lateral, PWA, redesign visual, tablet além de manter o comportamento atual.

## Decisions

### 1. Uma única fonte dos links, dois modos de exibição
O `Header` monta uma lista de itens de navegação (principais + Favoritos se `status === "authenticated"` + Admin se `user?.is_staff`) e a renderiza no `<nav>` desktop (`hidden md:flex`, como hoje) e no menu mobile (`md:hidden`). As regras de visibilidade ficam num lugar só, então o menu mobile não pode divergir do desktop. Alternativa (duplicar os `<Link>`s no menu) rejeitada por permitir divergência — que foi justamente a origem do problema.

### 2. Menu mobile: estado no Header, painel abaixo do header
`Header` já é componente cliente. Ganha `const [menuOpen, setMenuOpen] = useState(false)`, um botão `md:hidden` (ícones `Menu`/`X` do lucide-react) com `aria-expanded`, `aria-controls` (id do painel) e `aria-label` "Abrir menu"/"Fechar menu", e um painel `md:hidden` logo abaixo da barra (dentro do `<header>`, mesmo fundo/borda, largura total) com a lista vertical. Fecha: ao acionar um link (`onClick`), ao mudar `usePathname()` (efeito), ao acionar o botão de novo e com Esc (listener de teclado enquanto aberto). Decisão de layout: o header mobile mostra logo, ação de conta (Entrar/Sair) e botão de menu; o nome do usuário ("Olá, …") aparece no topo do painel do menu, já que não cabe na barra.

### 3. Alvos de toque só no mobile
Padrão: altura de 44px sem prefixo e retorno ao tamanho atual em `md:`, para o desktop não mudar.
- Links do menu: `min-h-11` (44px) com `py`/`flex items-center`.
- Entrar/Sair: o `Button size="sm"` do header ganha `h-11 md:h-7` (sobrescreve a altura só no mobile).
- Footer: cada link vira `inline-flex min-h-11 items-center md:min-h-0`, com o `gap` da lista reduzido no mobile (`gap-0 md:gap-2`) para não crescer demais a coluna no desktop.
- "Ver todos →" da Home: mesmo padrão `inline-flex min-h-11 items-center md:min-h-0`.
- Abas do painel: `py-2.5 md:pb-2` (ou `min-h-11 flex items-center` no mobile) mantendo a borda inferior ativa alinhada.
O botão de menu também é `size-11` no mobile.

### 4. Footer em 3 colunas no celular
Confirmar na verificação se `grid-cols-3` cabe em 320px/375px com links de 44px. Se as colunas ficarem apertadas ou quebrarem palavras, usar `grid-cols-1 sm:grid-cols-3` (mobile em coluna única) — decisão tomada na implementação com a medição, dentro do escopo "sem cortar conteúdo", sem alterar o desktop.

### 5. Card: métricas com quebra de linha
`PropertyCard.tsx`: a linha `flex items-center gap-4 text-sm` ganha `flex-wrap gap-x-4 gap-y-1`, para quebrar em vez de ser cortada pelo `overflow-hidden` do card. No desktop, onde já cabe, nada muda.

### 6. Verificação como parte da spec
A spec `mobile-access` é verificável e a matriz vira tarefa: para cada rota da lista, em 375px e 320px, medir `scrollWidth <= innerWidth`, elementos com borda direita além da largura (fora de contêineres com rolagem própria, como o mapa) e alturas de alvos de toque; e o conteúdo do menu nos três perfis (não logado, logado sem staff, staff). As rotas de painel e de perfis dependem de `/auth/me`: usar um proxy local de teste (Node) que responde `/auth/me` para `staff-token`/`user-token` e repassa o resto (GET) à produção, sem escrever nada em produção. O emulador de viewport do browser não cobre toque real, teclado virtual nem safe-area; isso é registrado como verificação que só o usuário faz num aparelho.

## Risks / Trade-offs

- [Aumentar áreas de toque pode alterar o desktop sem querer] → todo ajuste usa o par "mobile sem prefixo + `md:` restaura"; a verificação inclui comparar o desktop antes/depois (header sem botão de menu, footer e abas com o tamanho anterior).
- [Header mobile apertado em 320px (logo + conta + menu)] → verificação em 320px; se apertar, reduzir espaçamentos da barra no mobile, sem esconder a ação de conta.
- [Medir "cortado" por posição é uma aproximação] → complementar com inspeção visual (screenshot) das rotas com achados.
