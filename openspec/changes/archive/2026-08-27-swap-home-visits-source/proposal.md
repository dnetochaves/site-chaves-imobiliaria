## Why

A seção "Selecionados para hoje" da Home diz respeito a imóveis com visita disponível nas próximas 48 horas, mas hoje busca dados de `GET /imoveis` (a listagem genérica de busca) — não do endpoint que a própria API já expõe pra isso, `GET /visitas/disponiveis-em-breve`. Esse endpoint não tinha os dados comerciais necessários (título, preço) quando a Home foi construída; o backend corrigiu isso nesta sessão, então agora dá pra usar o endpoint certo.

## What Changes

- A seção "Selecionados para hoje" da Home passa a buscar dados de `GET /visitas/disponiveis-em-breve` em vez de `GET /imoveis`.
- Os cards dessa seção passam a exibir um indicativo real de quando a próxima visita está disponível (dado `proxima_visita_em`, agora exposto pelo endpoint) — antes omitido por falta de dado real.
- Novo hook `use-visitas-disponiveis-em-breve.ts` e um novo componente específico da Home; `PropertyListing`/`useImoveis` (usados por outras partes do site) não mudam.

## Capabilities

### Modified Capabilities
- `home-page`: a seção "Selecionados para hoje" passa a usar o endpoint de visitas disponíveis em breve como fonte de dados, e passa a exibir a informação real de próxima visita disponível.

## Impact

- `src/app/page.tsx`: troca `<PropertyListing limit={4} />` por um novo componente específico da Home.
- Novo `src/lib/api/hooks/use-visitas-disponiveis-em-breve.ts`.
- Novo `src/app/_home/SelecionadosParaHoje.tsx` (ou nome equivalente), reaproveitando `PropertyCard` e `toPropertyDisplayData`.
- Nenhuma mudança em `PropertyListing.tsx`, `useImoveis`, ou na spec `property-listing`.
