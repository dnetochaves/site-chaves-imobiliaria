## Context

Ver [proposal.md](proposal.md) para o porquê. O projeto já tem: `useImoveis` (TanStack Query sobre `GET /imoveis`), `PropertyCard` (card em grade), `MapView` (MapLibre GL, sem provedor de tiles definido — decisão adiada até este change), `Button`/`Input`/`Label` do shadcn/ui. A Home já envia usuários para `/busca?local=...&operacao=...`, `/busca?bairro=...`, `/busca?quartos=...`, `/busca?aceita_pets=true`.

`ImovelSummary.unidade` traz `latitude`/`longitude` (string), então dá pra plotar cada resultado no mapa sem endpoint novo.

## Goals / Non-Goals

**Goals:**
- Fechar o ciclo de navegação: todo link que já aponta pra `/busca` passa a levar a uma tela funcional.
- Filtros como fonte única de verdade na URL (compartilhável, alinhado com o que a Home já envia).

**Non-Goals:**
- Busca automática ao mover/arrastar o mapa (o toggle "Atualizar ao mover" fica só visual).
- Página de detalhe do imóvel (cards linkam pra `/imoveis/{id}`, 404 esperado).
- Favoritos funcionais (mesmo ícone decorativo já usado na Home).
- Filtro de local livre por rua/metrô — a API só expõe filtro por `bairro`, então o campo de local da Busca mapeia pra esse parâmetro (ver Decisão 3).

## Decisions

**1. Filtros na URL como fonte única de verdade.**
Cada mudança de filtro atualiza a query string via `router.push` (mesmo padrão do `Hero.tsx` da Home), e a página lê o estado inicial via `useSearchParams()`. Evita duplicar estado entre "o que a Home mandou" e "o que a Busca mostra", e torna a URL compartilhável. Alternativa considerada: estado local (`useState`) com sincronização manual pra URL — descartada por duplicar a fonte de verdade sem necessidade.

**2. Paginação via parâmetro `page` (1-indexed) na URL, convertido para `offset` internamente** (`offset = (page - 1) * limit`). Mais legível numa URL compartilhada do que expor `offset` bruto.

**3. Campo "local" mapeia para o parâmetro `bairro` da API.**
A API não tem busca textual livre por rua/metrô/cidade — só `bairro` (string exata/parcial, conforme já usado pelos chips da Home). O campo de busca da Busca reaproveita esse mesmo parâmetro. Isso é uma simplificação deliberada, não um bug: se o usuário digitar algo que não é um bairro válido, a API provavelmente retorna lista vazia (comportamento já coberto pelo estado de "lista vazia" do `property-listing`).

**4. Ordenação: parâmetro `ordenar` da API recebe `"preco_asc"` para "Menor preço".**
O schema gerado tipa `ordenar` como `string` livre, sem enum documentado — o valor exato esperado pelo backend não está confirmado. Assumindo a convenção `campo_direcao` (comum em APIs REST). Se o backend não reconhecer esse valor, o comportamento observável é só "não reordena" (não quebra a busca) — a ordenação visual da lista também pode ser feita client-side como fallback se necessário. Fica registrado como ponto a confirmar com o backend, não bloqueia o change.

**5. Novo card de lista horizontal: `src/components/property/PropertyListItem.tsx`.**
Mesma lógica de mapeamento `ImovelSummary → props` já usada em `PropertyListing.tsx` (reaproveitada, não duplicada — extraída para uma função compartilhada `toPropertyDisplayData`). Specs em formato de pill (m², quartos, mobiliado, aceita pets), preço, coração decorativo — mesma decisão de "sem badge de disponibilidade" já tomada em `revise-home-content`.

**6. `MapView` ganha suporte a marcador customizado com rótulo de preço e estado de destaque.**
Hoje `MapMarker` só aceita `{ id, center }` e usa o marcador padrão do MapLibre (sem rótulo). Estende para `{ id, center, label, highlighted? }`, renderizando um elemento DOM customizado (pill) por marcador em vez do teardrop padrão — necessário pra bater com o mockup (marcadores mostram "3,4 mil" etc). É uma extensão retrocompatível (props novas opcionais), não uma reescrita.

**7. Mapa ajusta automaticamente os limites (`fitBounds`) para caber todos os marcadores quando os resultados mudam.**
Sem isso, o mapa ficaria sempre no center/zoom default independente da busca, o que não é utilizável. Não é um requisito formal na spec (é comportamento esperado implícito de "o mapa exibe os imóveis"), mas necessário pra a Decisão de design funcionar de verdade.

**8. Provedor de tiles: OpenFreeMap (decisão já tomada com o usuário) via `style: "https://tiles.openfreemap.org/styles/liberty"`.**
Gratuito, sem chave de API. Troca de estilo/URL isolada em uma constante, fácil de reconfigurar depois se o volume de tráfego justificar outro provedor.

**9. Sincronização lista↔mapa via estado `hoveredId` levantado para o componente da página `/busca`**, passado tanto pra lista (dispara `onMouseEnter`/`onMouseLeave` por card) quanto pro mapa (decide qual marcador reflete `highlighted`).

**10. Componentes shadcn novos: `select` (ordenação) e `checkbox` (mobiliado/aceita pets em "Mais filtros"), adicionados via `npx shadcn add select checkbox`** — nenhum componente de UI construído do zero quando o shadcn já resolve.

**11. "Mais filtros" como uma seção expansível inline (toggle simples), não um popover/modal.**
Reduz complexidade — não precisa de um novo primitivo de overlay pra dois checkboxes.

## Risks / Trade-offs

- **[Risco] Valor de `ordenar` pode não ser o que o backend espera** → Mitigação: documentado na Decisão 4; comportamento degrada de forma segura (lista continua funcionando, só não reordena).
- **[Risco] `latitude`/`longitude` de `UnidadeRead` são strings — parsing incorreto quebraria os marcadores** → Mitigação: `parseFloat` com fallback para omitir o marcador (não quebrar o mapa) se o valor não for um número válido.
- **[Trade-off] Toggle "Atualizar ao mover" sem função real** → Aceito conscientemente (Non-Goal); fica visualmente presente e desabilitado ou apenas decorativo, para não prometer um comportamento que não existe.

## Open Questions

Nenhuma pendente que afete specs, abordagem ou tasks deste change — o valor exato de `ordenar` (Decisão 4) é um ponto a confirmar com o backend depois, mas não muda a implementação nem os requirements.
