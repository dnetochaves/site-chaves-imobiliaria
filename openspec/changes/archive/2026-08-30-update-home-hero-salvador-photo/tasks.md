## 1. Hero da Home: foto e textos

- [x] 1.1 Substituir o `bg-background-muted` do container de imagem em `Hero.tsx` por `<Image src="/home-hero.jpg" fill className="object-cover" />`, mantendo `HeroFeaturedCard` e os elementos novos posicionados por cima
- [x] 1.2 Atualizar eyebrow para "Aluguel e compra · Salvador e região metropolitana"
- [x] 1.3 Atualizar placeholder do campo de busca para "Bairro, rua ou praia"
- [x] 1.4 Atualizar `NEIGHBORHOOD_CHIPS` para `["Rio Vermelho", "Barra", "Pituba", "Graça"]`

## 2. Hero da Home: elementos de credibilidade

- [x] 2.1 Atualizar `FEATURED_EXAMPLE` em `HeroFeaturedCard.tsx`: `neighborhood: "Horto Florestal"`, `city: "BA"`, adicionar badge de visita ("Visita hoje 18h") e metragem/vagas ("78 m² · 1 vaga")
- [x] 2.2 Criar componente de selo de estatística ("84 chaves entregues em agosto") posicionado no canto superior direito da foto do Hero
- [x] 2.3 Criar componente de card de credibilidade ("Visita com gente de verdade" / "Um corretor te acompanha do primeiro clique à chave na mão.") posicionado no canto inferior direito da foto do Hero, ao lado do `HeroFeaturedCard`

## 3. Página /sobre

- [x] 3.1 Substituir o texto do parágrafo de abertura em `sobre/page.tsx` pelo novo texto focado em Salvador, sem alterar H1, diferenciais ou CTA final

## 4. Verificação visual

- [x] 4.1 Rodar o app localmente, abrir a Home e conferir: foto real de fundo no Hero, eyebrow/placeholder/chips atualizados, `HeroFeaturedCard` com dado novo, selo e card de credibilidade visíveis e legíveis sem sobrepor mal os outros elementos
- [x] 4.2 Abrir `/sobre` e conferir que só o parágrafo de abertura mudou (H1, diferenciais e CTA final idênticos a antes)
- [x] 4.3 Navegar por `/alugar`, `/comprar`, `/busca` e um card de imóvel, conferindo que nada mais no site foi afetado por este change
