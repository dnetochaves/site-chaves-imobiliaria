## 1. Logo no Header/Footer

- [x] 1.1 Reescrever `Logo.tsx` pra renderizar o SVG oficial (`logo-principal-positiva`) inline como JSX dentro do `<Link href="/">` existente, com `fontFamily`/cores via variáveis CSS do design system, removendo o SVG placeholder desenhado à mão e o texto hardcoded "chaves" (ver design.md — decisão revisada de `<img>` pra SVG inline durante a implementação, por causa de herança de fonte)
- [x] 1.2 Verificar visualmente no Header (fundo branco) e no Footer (fundo bege) que a logo renderiza nítida, com o texto "chaves imobiliária" na tipografia certa (Plus Jakarta Sans + IBM Plex Mono)

## 2. Favicon oficial

- [x] 2.1 Gerar `src/app/favicon.ico` (multi-resolução, 16/32/48/64px) a partir de `public/logo-png/favicon/favicon-{16,32,48,64}px.png`, substituindo o placeholder do `create-next-app`
- [x] 2.2 Verificar a aba do navegador mostrando o favicon novo (pode exigir hard refresh / limpar cache do navegador pra não mostrar o favicon antigo em cache)

## 3. Verificação responsiva e de regressão

- [x] 3.1 Testar a Home em viewport mobile (`resize_window` preset mobile) e confirmar que a logo não aperta o layout do Header ao lado do botão "Entrar"; se apertar, voltar ao design.md pra decidir o fallback condicional pro `logomark`
- [x] 3.2 Navegar por 2-3 páginas (`/alugar`, `/sobre`) confirmando que Header e Footer continuam consistentes em todo o site, sem quebrar nenhuma outra funcionalidade
