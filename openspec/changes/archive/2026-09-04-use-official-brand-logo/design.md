## Context

`Logo.tsx` é um componente compartilhado (`Header.tsx` e `Footer.tsx` importam o mesmo), renderizando hoje um SVG inline desenhado à mão. O pacote oficial está em `public/logo-svg/logo-principal/logo-principal-positiva.svg` (161×60, símbolo + "chaves" em negrito + "imobiliária" em mono caps menor, cores `#0D4650`/`#D2954F`).

`next.config.ts` não tem `images.dangerouslyAllowSVG` habilitado — o otimizador de imagem do Next.js (`<Image>`) bloqueia arquivos `.svg` por padrão nesse caso (retorna erro). Não vale a pena mudar essa config só pra logo: SVGs de logo são pequenos (poucos KB) e vetoriais, não se beneficiam da otimização de raster do Next de qualquer forma.

## Goals / Non-Goals

**Goals:**
- Header e Footer exibem a logo oficial da marca (`logo-principal-positiva.svg`), substituindo o placeholder.
- Favicon oficial no lugar do placeholder do `create-next-app`.

**Non-Goals:**
- Variantes cromáticas além de `positiva` (sem fundo escuro no site hoje).
- `app-icon` (ícone de app iOS/Android) — sem PWA configurado.
- Mudar `Header.tsx`/`Footer.tsx` além de continuarem usando `<Logo />` como já fazem.

## Decisions

### 1. SVG inline no componente, não `<img>` nem `next/image`
Como `next/image` bloqueia `.svg` sem `dangerouslyAllowSVG`, a primeira tentativa foi uma tag `<img>` nativa apontando pro arquivo em `public/logo-svg/logo-principal/logo-principal-positiva.svg`. Revertido durante a implementação: um SVG carregado via `<img src="...">` é renderizado em modo "imagem", isolado do documento — não herda `@font-face`/CSS da página. Como o texto do SVG usa `font-family="Plus Jakarta Sans"`/`"IBM Plex Mono"` sem embutir a fonte no próprio arquivo, o `<img>` renderizaria com a fonte de fallback do sistema (não a fonte real carregada via `next/font`), quebrando a consistência tipográfica da marca.

Corrigido incorporando o markup do SVG diretamente como JSX em `Logo.tsx` (mesmo padrão que o placeholder original já usava), com `fontFamily` apontando pras variáveis CSS já compostas em `globals.css` (`var(--font-sans)`, `var(--font-mono)` — mesmas usadas pelo `font-sans`/`font-mono` do Tailwind no resto do site) e as cores via `var(--color-brand-primary)`/`var(--color-brand-secondary)`/`var(--color-text-muted)` em vez de hex fixo. `width`/`height` explícitos (161×60, dimensões reais do viewBox) evitam layout shift; `h-10 w-auto` controla a altura renderizada (~40px, cabe confortavelmente no header de 64px de altura).

Trade-off aceito: o conteúdo do SVG fica duplicado entre `public/logo-svg/...` (fonte de verdade pro pacote de marca, usada também na geração do favicon) e o JSX inline (única forma de garantir renderização tipográfica correta no navegador) — atualização futura da logo exige editar os dois lugares, documentado no comentário do componente.

### 2. Sem fallback responsivo pra `logomark` no mobile (a menos que a verificação visual mostre necessidade)
O usuário autorizou trocar pra outro formato "caso ela diminua" demais. Com a logo principal em ~40px de altura (~107px de largura, proporção 161:60), sobra espaço confortável mesmo no menor viewport comum (320px) ao lado do botão "Entrar"/menu. Decisão: implementar só a logo principal primeiro, verificar visualmente em mobile (`resize_window` preset mobile) antes de fechar a tarefa — só adicionar a troca condicional pro `logomark` se a verificação mostrar aperto real. Evita complexidade não comprovadamente necessária.

### 3. Favicon: gerar um `.ico` multi-resolução a partir dos PNGs prontos
`src/app/favicon.ico` (convenção de arquivo do App Router) precisa ser um `.ico` de verdade (não um PNG renomeado) pra funcionar em todos os navegadores. O pacote já tem os PNGs prontos em `public/logo-png/favicon/` (16, 32, 48, 64px, traço engrossado). Gerar o `.ico` combinando esses 4 tamanhos com Pillow (já usada nesta sessão pra outras tarefas de imagem, sem dependência nova) em vez de converter o SVG do zero — os PNGs já foram desenhados especificamente pra esses tamanhos pequenos.

## Risks / Trade-offs

- [Fonte do texto do SVG (`Plus Jakarta Sans`/`IBM Plex Mono`) depende do CSS global do site já ter essas fontes carregadas — se `Logo.tsx` algum dia for usado fora do layout principal (ex.: um e-mail transacional), o texto renderizaria com a fonte de fallback do sistema] → Sem mitigação necessária agora: `Logo.tsx` só é usado dentro de `Header`/`Footer`, sempre dentro do `RootLayout` que carrega as fontes.
