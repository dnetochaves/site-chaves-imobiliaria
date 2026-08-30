## Context

`Hero.tsx` hoje renderiza a área de imagem como `<div className="bg-background-muted relative aspect-[4/3] overflow-hidden rounded-xl"><HeroFeaturedCard /></div>` — só cor chapada, sem `<Image>`. `HeroFeaturedCard.tsx` é um card absoluto no canto inferior esquerdo com dado de exemplo explicitamente documentado como ilustrativo (não vem da API). A foto nova (`public/home-hero.jpg`) foi extraída em alta resolução do PDF de design fornecido pelo usuário e já processada (recortada para excluir a faixa inferior onde os cards do mockup ficam sobrepostos, evitando duplicar visualmente elementos que também serão renderizados como HTML real).

## Goals / Non-Goals

**Goals:**
- Hero da Home reflete o novo design: foto real de fundo, textos/chips voltados a Salvador, dois elementos novos de credibilidade.
- `/sobre` reflete o novo parágrafo de abertura, sem alterar o resto da página.

**Non-Goals:**
- Qualquer mudança fora do Hero da Home e do parágrafo de abertura de `/sobre` (ver proposal.md, Fora de escopo).
- Seção "Quem cuida disso" em `/sobre` — decidido com o usuário não incluir (pessoas fictícias, sem fotos reais).
- Pixel-perfect do mockup — os dois elementos novos usam ícones do lucide-react já padrão no projeto, não a marca exata da Chaves (ver Decisão 2).

## Decisions

### 1. Foto de fundo via `<Image>` do Next, cards existentes continuam por cima
`Hero.tsx` passa a renderizar `<Image src="/home-hero.jpg" alt="..." fill className="object-cover" />` como primeiro filho do container `aspect-[4/3] overflow-hidden rounded-xl` (mesmo padrão já usado em `PropertyCard`/`PropertyGallery`), com `HeroFeaturedCard` e os dois novos elementos posicionados `absolute` por cima, exatamente como hoje. A foto já foi recortada para não incluir a faixa inferior do mockup (onde os cards ficam sobrepostos) — evita qualquer duplicação visual entre pixels da foto e os cards HTML reais.

### 2. Dois componentes novos, pequenos e sem estado
- Selo de estatística: pequeno componente com um ícone de check (lucide `BadgeCheck`, já no padrão de ícones do projeto — não a marca exata da Chaves do mockup) + texto "84 chaves entregues em agosto", posicionado `absolute top-4 right-4` sobre a foto.
- Card de credibilidade: componente com título "Visita com gente de verdade" e texto "Um corretor te acompanha do primeiro clique à chave na mão.", fundo `bg-brand-secondary` (laranja, já um token do design system), posicionado `absolute bottom-4 right-4`, ao lado do `HeroFeaturedCard` (que continua `bottom-4 left-4`).
- Ambos sem prop nem estado — texto fixo, mesmo padrão de dado ilustrativo do `HeroFeaturedCard` (comentário no código deixa claro que "84 chaves entregues em agosto" é uma estatística real fornecida pela administração, não fabricada — ver Riscos).

### 3. `HeroFeaturedCard`: atualizar só o objeto `FEATURED_EXAMPLE`
Sem mudança de estrutura/props — só os valores: `neighborhood: "Horto Florestal"`, `city: "BA"`, adicionar campos novos pro badge de visita ("Visita hoje 18h") e metragem/vagas ("78 m² · 1 vaga"), seguindo o mesmo padrão de dado de exemplo documentado.

### 4. `sobre/page.tsx`: só o parágrafo de abertura
Trocar o valor do `<p>` do parágrafo de abertura pelo texto novo. H1, diferenciais e CTA final continuam byte-a-byte iguais — nenhuma outra edição no arquivo.

## Risks / Trade-offs

- ["84 chaves entregues em agosto" é uma string fixa no código, não vem de uma fonte de dados real] → Aceitável pelo escopo deste change (o usuário confirmou que é uma estatística real e forneceu o texto exato) — mas fica sujeita a ficar desatualizada com o tempo (ex.: "agosto" deixa de ser o mês corrente). Fora de escopo tornar isso dinâmico agora; comentário no código documenta a origem (dado real fornecido pelo usuário nesta data) para facilitar revisão futura.
- [Foto extraída de um PDF renderizado, não do arquivo-fonte original] → Resolução final (1200×702) é adequada pra um hero grande, mas se o usuário tiver o arquivo de foto original em resolução maior, vale substituir depois — não bloqueia este change.
