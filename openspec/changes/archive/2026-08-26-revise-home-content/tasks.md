## 1. Hero

- [x] 1.1 Adicionar eyebrow "ALUGUEL E COMPRA · SÃO PAULO" (cor `brand.secondary`) e o parágrafo de apoio abaixo da headline em `src/app/_home/Hero.tsx`, e verificar visualmente
- [x] 1.2 Adicionar chips de bairro rápido (Pinheiros, Vila Madalena, Santa Cecília) abaixo do form de busca, navegando para `/busca?bairro=...`, e verificar os `href`/navegação gerados — confirmado os 3 hrefs corretos
- [x] 1.3 Criar `src/app/_home/HeroFeaturedCard.tsx` com dados estáticos de exemplo (comentário "dado de exemplo, não vem da API") — bairro, título, preço — e o placeholder de imagem de hero ao lado do form, e verificar renderização em desktop
- [x] 1.4 Verificar o Hero completo em 375px (form empilhado, imagem/card em destaque não quebram o layout, sem overflow horizontal) — confirmado 1 coluna, form em column, sem overflow

## 2. Selecionados para hoje

- [x] 2.1 Adicionar subtexto "Imóveis com visita disponível nas próximas 48 horas." e link "Ver todos →" (navega para `/busca`) no header da seção em `src/app/page.tsx`, e verificar navegação — confirmado href `/busca` e subtexto presente
- [x] 2.2 Adicionar ícone de favorito decorativo (sem estado, sem `onClick`) no canto superior direito de `PropertyCard`, e verificar que nenhum clique dispara chamada de API ou mudança de estado — confirmado: `<span>` sem `onclick`, sem estado React
- [x] 2.3 Confirmar que nenhum badge tipo "Visita hoje" foi adicionado aos cards reais (decisão registrada em design.md — omitido por falta de dado real), revisando o componente — confirmado, `PropertyCard` não tem esse badge

## 3. Atalhos por perfil

- [x] 3.1 Reescrever `src/app/_home/CategoryShortcuts.tsx`: título "Comece por onde faz sentido", 4 cards (Morar sozinho, Com a família, Com pets, Primeiro imóvel) com ícone (lucide-react) + descrição curta, e verificar renderização
- [x] 3.2 Implementar a navegação de cada atalho conforme design.md (`/busca?quartos=1`, `/busca?quartos=3`, `/busca?aceita_pets=true`, link WhatsApp externo com placeholder documentado), e verificar os 4 destinos gerados — todos os 4 confirmados corretos
- [x] 3.3 Verificar em 375px que os 4 cards não quebram o layout (sem overflow horizontal) — confirmado sem overflow

## 4. Banner de condomínio

- [x] 4.1 Adicionar badge "NOVO · CHAVES CONDOMÍNIOS", subtexto e texto de diagnóstico gratuito em `src/app/_home/CondoBanner.tsx`, e verificar visualmente
- [x] 4.2 Adicionar o segundo botão ("Como funciona", variante outline) ao lado de "Pedir uma proposta", e verificar que ambos são clicáveis com destinos distintos — corrigido bug de especificidade CSS (override de cor não vencia a classe base do Button; resolvido com `!important`)
- [x] 4.3 Criar `src/app/_home/CondoStatsCard.tsx` com os dados estáticos de exemplo (Ed. Aurora, métricas, 3 pills de estatística, comentário "dado de exemplo, não vem da API") e posicioná-lo ao lado do banner, e verificar renderização
- [x] 4.4 Verificar o banner completo em 375px (banner e card de estatísticas empilham sem overflow) — confirmado sem overflow

## 5. CTA "Tem um imóvel para alugar?"

- [x] 5.1 Conferir o subtexto contra o mockup e ajustar se necessário em `src/app/_home/ListPropertyCta.tsx` — corrigido pra "Anunciamos, cuidamos das visitas e garantimos o pagamento todo mês." (texto exato do mockup)
- [x] 5.2 Adicionar o segundo botão ("Falar com alguém", variante outline) ao lado de "Anunciar imóvel", e verificar que ambos são clicáveis com destinos distintos

## 6. Verificação final

- [x] 6.1 Rodar `npm run lint` e `npm run build` e verificar que ambos completam sem erro
- [x] 6.2 Revisar a Home completa no browser lado a lado com o mockup (`design_system/sistema-montado.pdf`) e listar visualmente qualquer divergência restante — conteúdo confere seção por seção, na ordem correta; nenhuma divergência de conteúdo restante (diferenças aceitas e documentadas: ícones não são pixel-perfect ao mockup, badge "Visita hoje" omitido por decisão, dados de imóveis/condomínio reais/ilustrativos conforme já registrado)
- [x] 6.3 Verificar que nenhum valor hardcoded (hex, cor fora do tema) foi introduzido, e que os componentes reutilizam `Button`/`Input` de `src/components/ui` — nenhum hex encontrado; todos os botões/inputs novos reusam `src/components/ui`
