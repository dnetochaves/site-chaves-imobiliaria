## 1. Página Trabalhe conosco

- [x] 1.1 Criar `src/app/trabalhe-conosco/page.tsx` com label, título e subtítulo voltados a corretores parceiros (cobrindo venda/locação dos imóveis da Chaves e administração/gestão de condomínios) e a ação de contato via WhatsApp (`buildWhatsappHref`), sem nenhuma lista de vagas, processo seletivo ou benefícios inventados, e verificar visualmente e que o link de WhatsApp é montado corretamente no browser — confirmado visualmente e o link tem a URL `wa.me` correta com a mensagem "Sou corretor e quero ser parceiro da Chaves"

## 2. Verificação final

- [x] 2.1 Rodar `npm run lint` e `npm run build` e verificar que ambos completam sem erro — ambos passam limpos
- [x] 2.2 Verificar que nenhum valor hardcoded (hex, cor fora do tema) foi introduzido, e que os componentes reutilizam `Button`/estilos já existentes — `grep` por hex não encontrou nada; reutiliza `Button` e a mesma estrutura visual das outras páginas institucionais
- [x] 2.3 Verificar que o link "Trabalhe conosco" já existente no Footer leva pra página funcionando, em vez do 404 anterior — confirmado no browser, `href="/trabalhe-conosco"` no Footer e a página carrega normalmente
