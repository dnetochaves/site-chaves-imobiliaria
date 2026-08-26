## 1. Header

- [x] 1.1 Criar `src/components/shell/Header.tsx` com logo "chaves" (reusar o ícone/wordmark já usado no restante do projeto) e verificar que renderiza sem erros em uma página de teste — logo criado como componente próprio (`Logo.tsx`) já que não existia asset de marca ainda no projeto, seguindo o desenho visto no PDF (C em petroleo + barra em areia)
- [x] 1.2 Adicionar os links de navegação (Alugar, Comprar, Anunciar, Ajuda) apontando para `/alugar`, `/comprar`, `/anunciar`, `/ajuda`, e verificar os `href` gerados
- [x] 1.3 Adicionar as ações "Entrar" (link) e "Criar conta" (Button do shadcn, variante default) apontando para `/entrar` e `/criar-conta`, e verificar os `href`/estilo
- [x] 1.4 Implementar o comportamento mobile (abaixo de `md`): esconder os 4 links de navegação e "Entrar", manter logo + "Criar conta", e verificar em viewport 375px que não há overflow horizontal — confirmado: `display: none` em nav e "Entrar", sem overflow

## 2. Footer

- [x] 2.1 Criar `src/components/shell/Footer.tsx` com logo, "CRECI 00000-J · São Paulo, SP" e "CNPJ 00.000.000/0001-00" (comentário no código marcando como placeholder do Design System), e verificar renderização
- [x] 2.2 Adicionar as 3 colunas de links (Buscar: Alugar/Comprar/Bairros; Proprietários: Anunciar/Garantia/Gestão; Chaves: Sobre/Trabalhe conosco/Ajuda) com os `href` correspondentes, e verificar os 9 links gerados — confirmado no browser: 9 links do footer + logo, todos com href correto
- [x] 2.3 Verificar responsividade do footer em 375px (colunas empilham ou se ajustam sem overflow) — confirmado sem overflow, 3 colunas mantidas (labels curtos cabem)

## 3. Integração no layout

- [x] 3.1 Envolver `{children}` em `src/app/layout.tsx` com `<Header />` e `<Footer />`, e verificar que a Home (rota `/`) renderiza com header no topo e footer no final
- [x] 3.2 Verificar que os componentes usam só tokens/classes do tema (sem hex/valores hardcoded) e reutilizam `Button` de `src/components/ui` — nenhum hex encontrado (o SVG da logo usa `var(--color-...)`); Header reusa `Button` do shadcn

## 4. Verificação final

- [x] 4.1 Rodar `npm run lint` e `npm run build` e verificar que ambos completam sem erro
- [x] 4.2 Verificar no browser que clicar em qualquer link do header/footer gera 404 (comportamento esperado, não uma falha) e que a Home continua funcionando normalmente com o shell ao redor — confirmado `/alugar` → 404 (com header/footer ainda presentes), Home renderizando normal com imóveis reais agora disponíveis na API
