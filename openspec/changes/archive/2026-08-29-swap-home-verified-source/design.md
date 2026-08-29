## Context

Ver [proposal.md](proposal.md) para o porquê. O backend corrigiu nesta sessão o filtro `verificado` em `GET /imoveis` (antes silenciosamente ignorado) — confirmado ao vivo (`verificado=true` → 0 resultados, `verificado=false` → 3, batendo com os dados reais) e o schema já foi regenerado (`npm run api:types`). `useImoveis`/`toPropertyDisplayData` já existem e são o padrão usado por `PropertyListing`, `/alugar` e `/comprar`.

## Goals / Non-Goals

**Goals:**
- Seção "Selecionados para hoje" reflete o critério real (curadoria via `verificado`), não mais visita agendada.

**Non-Goals:**
- UI de administração pra marcar um imóvel como verificado — fora do frontend público.
- Mudar `PropertyListing`/`useImoveis` — continuam servindo outras páginas exatamente como hoje.

## Decisions

**1. `SelecionadosParaHoje.tsx` passa a usar `useImoveis({ verificado: true, limit: 4 })` diretamente, no lugar de `useVisitasDisponiveisEmBreve()`.**
Como o critério novo é só mais um filtro de `GET /imoveis` (já suportado por `useImoveis`), não precisa de nenhum hook novo — ao contrário da troca anterior (`swap-home-visits-source`), que precisou de um endpoint dedicado.

**2. Badge de "próxima visita" (`nextVisitLabel`) removido dessa seção — não é passado mais pro `PropertyCard` aqui.**
`ImovelSummary` (o shape retornado por `GET /imoveis`) não tem nenhum dado de visita associado; mostrar esse badge exigiria inventar ou buscar dado de outro lugar, o que não faz sentido pro critério de curadoria. A prop `nextVisitLabel` do `PropertyCard` continua existindo — é uma capability genérica do componente, não fica órfã só porque essa seção específica não a usa mais.

**3. Texto da seção atualizado de "Imóveis com visita disponível nas próximas 48 horas." pra "Imóveis selecionados pela nossa equipe." — e a mensagem de lista vazia de "Nenhum imóvel com visita disponível no momento." pra "Nenhum imóvel disponível no momento.", mesmo padrão genérico já usado em `PropertyListing`.**

**4. `use-visitas-disponiveis-em-breve.ts` (o hook do critério antigo) é removido — não fica sem uso no repositório.**
Nenhum outro lugar do site usa esse hook; mantê-lo sem uso seria código morto desde o primeiro commit deste change (diferente do caso do `PropertyListing.tsx`, que ficou órfão como efeito colateral de uma troca anterior e foi registrado como uma issue separada — aqui dá pra simplesmente não deixar o código morto entrar). O endpoint `GET /visitas/disponiveis-em-breve` continua existindo na API, só não é mais consumido pelo frontend.

## Risks / Trade-offs

- **[Trade-off] A seção fica vazia até algum imóvel real ser marcado como verificado** → Aceito conscientemente, é o estado real dos dados hoje, documentado no proposal.md; não é um bug deste change.
