## Why

O usuário atualizou o design (`Design-atualizado.pdf`, ciclo 03) do Hero da Home e do texto de abertura da página `/sobre`, posicionando a Chaves como uma imobiliária de Salvador/BA (em vez de São Paulo) e trocando a área de imagem ilustrativa do Hero — hoje uma cor chapada sem imagem real — por uma foto real de corretor com clientes. Esse update precisa ser refletido no site, mantendo tudo o que já foi construído em changes anteriores intacto.

## What Changes

- Hero da Home: nova foto de fundo, eyebrow/placeholder de busca/chips de bairro atualizados para Salvador, dado de exemplo do card ilustrativo atualizado, e dois elementos novos de credibilidade (selo de estatística + card de acompanhamento por corretor).
- Página `/sobre`: parágrafo de abertura atualizado para o texto focado em Salvador (restante da página não muda).

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `home-page`: o requisito de CTAs/credibilidade do Hero ganha um novo elemento observável (selo de estatística de chaves entregues + card de credibilidade sobre acompanhamento por corretor), antes inexistente.

## Impact

- `src/app/_home/Hero.tsx`: foto de fundo (`public/home-hero.jpg`, já extraída do PDF e salva no projeto), eyebrow, placeholder do campo de busca, lista de chips de bairro.
- `src/app/_home/HeroFeaturedCard.tsx`: dado de exemplo (bairro/cidade, badge de visita, metragem/vagas) — continua sendo dado ilustrativo, não vem da API (mesma natureza de antes).
- Dois componentes novos e pequenos no Hero (selo + card de credibilidade) — conteúdo estático, sem chamada à API.
- `src/app/sobre/page.tsx`: só o parágrafo de abertura.
- Nenhum outro arquivo/página/funcionalidade construída em changes anteriores é afetado (busca, mapas nos cards de imóvel, favoritos, autenticação, anunciar imóvel, garantia, trabalhe conosco, `/alugar`, `/comprar`, Footer).
