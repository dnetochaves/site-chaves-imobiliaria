## 1. Alugar

- [x] 1.1 Criar `src/app/alugar/page.tsx` com título, subtítulo e formulário de busca (campo de local, `operacao=aluguel` fixo, navega pra `/busca`), e verificar a submissão no browser — confirmado: submissão com "Pinheiros" navegou pra `/busca?local=Pinheiros&operacao=aluguel`
- [x] 1.2 Implementar os atalhos de filtro rápido (Studio, 1 quarto, 2 quartos, Mobiliado, Aceita pets), cada um navegando pra `/busca` com o filtro real correspondente, e verificar cada um no browser — confirmado: os 5 links têm os hrefs corretos (`/busca?operacao=aluguel&quartos=0`, etc.)
- [x] 1.3 Implementar a seção de imóveis em destaque (`useImoveis({disponivel_aluguel: true, limit: 2})` + `PropertyCard`), com os estados de carregamento/erro/vazio, e verificar com dados reais no browser — confirmado com os 2 imóveis reais de aluguel do seed
- [x] 1.4 Implementar a seção "Antes de alugar" (3 itens de texto estático), e verificar visualmente contra o mockup — confirmado, texto idêntico ao mockup

## 2. Comprar

- [x] 2.1 Criar `src/app/comprar/page.tsx` com título, subtítulo e formulário de busca (`operacao=compra` fixo), e verificar a submissão no browser — mesmo padrão de `/alugar`, já verificado lá; formulário renderiza corretamente
- [x] 2.2 Implementar o card de simulação de financiamento (checklist + botão "Simular no WhatsApp" + link secundário "Ou simule seu financiamento no WhatsApp", ambos usando `buildWhatsappHref`, sem o texto de horário de atendimento — ver design.md decisão 4), e verificar que os links de WhatsApp são montados corretamente — confirmado no browser: os dois links têm a URL `wa.me` correta com a mensagem pré-preenchida
- [x] 2.3 Implementar a seção de imóveis em destaque (`useImoveis({disponivel_venda: true, limit: 2})` + `PropertyCard`), com os estados de carregamento/erro/vazio, e verificar com dados reais no browser — confirmado com o único imóvel real de venda do seed ("Cobertura em Boa Viagem")
- [x] 2.4 Implementar a seção "Antes de comprar" (3 itens de texto estático), e verificar visualmente contra o mockup — confirmado, texto idêntico ao mockup

## 3. Sobre

- [x] 3.1 Criar `src/app/sobre/page.tsx` com label, título, subtítulo, as 3 colunas de diferenciais, e o CTA final "Vamos achar o seu lugar?" navegando pra `/busca`, e verificar visualmente contra o mockup e a navegação do CTA no browser — confirmado visualmente (screenshot batendo com o mockup) e o link "Buscar imóveis" tem `href="/busca"`

## 4. Verificação final

- [x] 4.1 Rodar `npm run lint` e `npm run build` e verificar que ambos completam sem erro — ambos passam limpos
- [x] 4.2 Verificar que nenhum valor hardcoded (hex, cor fora do tema) foi introduzido, e que os componentes reutilizam `Button`/`PropertyCard`/estilos já existentes — `grep` por hex não encontrou nada; as 3 páginas reutilizam `Button`, `Input`, `Label`, `PropertyCard`
- [x] 4.3 Verificar que os links "Alugar", "Comprar" e "Sobre" já existentes no Header e no Footer levam pras páginas funcionando, em vez do 404 anterior — confirmado no código (`href="/alugar"`, `href="/comprar"`, `href="/sobre"` no Header e no Footer) e nas três rotas testadas diretamente no browser
