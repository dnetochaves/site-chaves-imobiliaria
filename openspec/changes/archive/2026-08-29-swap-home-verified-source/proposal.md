## Why

O critério atual da seção "Selecionados para hoje" da Home (imóveis com visita agendada nas próximas 48h, `swap-home-visits-source`) deixa a seção vazia quase sempre, já que depende de haver uma visita ativa cadastrada. O critério real deveria ser outro: imóveis que a administração aprovou/curou pra aparecer ali — representado pelo campo `verificado`, que já existe nos dados mas que a API não aceitava como filtro de busca até o backend corrigir isso nesta sessão.

## What Changes

- A seção "Selecionados para hoje" da Home passa a buscar de `GET /imoveis?verificado=true` em vez de `GET /visitas/disponiveis-em-breve`.
- O badge de "próxima visita" nos cards dessa seção é removido (não faz mais sentido sem o critério de visita agendada).
- O texto da seção deixa de falar em "visita disponível" e passa a refletir o critério de curadoria.

## Capabilities

### Modified Capabilities
- `home-page`: a seção "Selecionados para hoje" passa a usar imóveis verificados pela administração como fonte de dados, em vez de imóveis com visita disponível em breve.

## Impact

- `src/app/_home/SelecionadosParaHoje.tsx`: troca `useVisitasDisponiveisEmBreve` por `useImoveis({ verificado: true, limit: 4 })`, remove o badge de próxima visita, atualiza o texto da seção.
- `src/app/page.tsx`: atualiza o subtítulo da seção (hoje fala em "visita disponível nas próximas 48 horas").
- Nenhuma mudança em `PropertyCard.tsx` (a prop `nextVisitLabel` continua existindo, só não é mais usada por essa seção).
- `use-visitas-disponiveis-em-breve.ts` fica sem uso — decisão sobre removê-lo ou mantê-lo registrada no design.md.
