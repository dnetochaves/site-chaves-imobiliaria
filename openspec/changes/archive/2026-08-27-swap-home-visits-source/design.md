## Context

Ver [proposal.md](proposal.md) para o porquê. O endpoint `GET /visitas/disponiveis-em-breve` (recém-corrigido pelo backend nesta sessão) agora retorna `UnidadeDisponibilidadeProxima[]`: `{ imovel: ImovelSummary, proxima_visita_em: string }` — o mesmo shape de `ImovelSummary` que `GET /imoveis` já retorna, reaproveitável por `toPropertyDisplayData` (`src/components/property/mapImovel.ts`) sem alterações.

## Goals / Non-Goals

**Goals:**
- Seção "Selecionados para hoje" usa o endpoint semanticamente correto.
- Exibir o dado real de próxima visita disponível, agora que existe.

**Non-Goals:**
- Qualquer mudança em `PropertyListing`, `useImoveis`, ou na spec `property-listing` — continuam servindo outras partes do site (ex.: Busca) exatamente como hoje.
- Paginação da seção além do link "Ver todos" já existente.

## Decisions

**1. Novo hook `useVisitasDisponiveisEmBreve()` em `src/lib/api/hooks/use-visitas-disponiveis-em-breve.ts`, seguindo o padrão de `use-imoveis.ts` (TanStack Query + `apiClient.GET`).**
Sem parâmetros — o endpoint não aceita filtros nem paginação.

**2. Novo componente `src/app/_home/SelecionadosParaHoje.tsx` substitui `<PropertyListing limit={4} />` em `src/app/page.tsx`, só nessa seção.**
`PropertyListing` é a capability genérica de listagem (`property-listing`) usada por outras páginas — acoplá-la a esse endpoint específico da Home quebraria essa reutilização. O novo componente busca com `useVisitasDisponiveisEmBreve()`, corta a lista em 4 itens no frontend (`slice(0, 4)`, já que a API não pagina), e renderiza `PropertyCard` diretamente com `toPropertyDisplayData(item.imovel)` — reaproveitando o mapper existente sem alterá-lo.

**3. Badge de "próxima visita" formatado por uma nova função `formatProximaVisita(isoDate: string): string` em `src/lib/format.ts`.**
Regras: mesma data local que agora → `"Visita hoje às HH:mm"`; dia seguinte → `"Visita amanhã às HH:mm"`; qualquer outro caso (não deveria ocorrer, já que o endpoint é escopado às próximas 48h, mas cobrindo defensivamente) → `"Visita em DD/MM às HH:mm"`. Renderizado como um badge no card, reaproveitando o estilo de badge já usado no projeto (ex.: badge de operação "Aluguel"/"Venda" do `PropertyCard`).

**4. `PropertyCard` ganha uma prop opcional `nextVisitLabel?: string`.**
Opcional porque `PropertyCard` continua sendo usado em outros contextos (Home antes, potencialmente outros no futuro) sem esse dado — quando ausente, nenhum badge extra é exibido, sem alterar o comportamento atual do componente pra quem não passa a prop.

**5. Lista vazia: a seção continua visível, com uma mensagem ("Nenhum imóvel com visita disponível no momento") no lugar dos cards — não desaparece.**
Consistente com o padrão já estabelecido em `PropertyListing`/outras listagens do projeto (nunca uma área em branco sem explicação).

## Risks / Trade-offs

- **[Trade-off] Corte de 4 itens feito no frontend, não pela API** → Aceito; é a mesma limitação de design do endpoint (sem paginação), e o volume esperado de imóveis com visita nas próximas 48h é pequeno.
