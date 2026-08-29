## 1. Página Garantia

- [x] 1.1 Criar `src/app/garantia/page.tsx` com label, título, subtítulo, as 3 colunas de diferenciais e o CTA final "Anunciar imóvel" navegando pra `/anunciar`, e verificar visualmente e a navegação do CTA no browser — confirmado visualmente (mesma estrutura de `/sobre`) e o link tem `href="/anunciar"`

## 2. Footer

- [x] 2.1 Remover a entrada "Bairros" do array `columns` (coluna "Buscar") em `src/components/shell/Footer.tsx`, e verificar no browser que o link não aparece mais e que os outros links da coluna continuam normais — confirmado: coluna "Buscar" agora só tem "Alugar" e "Comprar"

## 3. Verificação final

- [x] 3.1 Rodar `npm run lint` e `npm run build` e verificar que ambos completam sem erro — ambos passam limpos
- [x] 3.2 Verificar que nenhum valor hardcoded (hex, cor fora do tema) foi introduzido, e que os componentes reutilizam `Button`/estilos já existentes — `grep` por hex não encontrou nada; reutiliza `Button` e a mesma estrutura visual de `/sobre`
- [x] 3.3 Verificar que o link "Garantia" já existente no Footer leva pra página funcionando, em vez do 404 anterior — confirmado no browser, `href="/garantia"` no Footer e a página carrega normalmente
