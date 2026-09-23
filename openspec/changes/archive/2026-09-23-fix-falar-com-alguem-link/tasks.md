## 1. Corrigir o link

- [x] 1.1 Em `src/app/_home/ListPropertyCta.tsx`, trocar o `<Link href="/falar-com-alguem">` por um `<a>` usando `buildWhatsappHref` (mesmo padrão de `src/app/ajuda/page.tsx`: `target="_blank" rel="noopener noreferrer"`), com uma mensagem pré-preenchida no contexto de anunciar um imóvel; verificar `tsc`/`eslint` limpos

## 2. Verificação

- [x] 2.1 No browser, na Home, clicar em "Falar com alguém" e confirmar que abre `wa.me` com o número e a mensagem corretos, em vez de navegar para `/falar-com-alguem`
