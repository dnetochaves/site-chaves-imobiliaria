## Context

Ver [proposal.md](proposal.md) para o porquê. Conteúdo textual transcrito do mockup (`design_system/sistema-montado.pdf`, seções "Aluguel e Compra" e "Institucional") já registrado no proposal.md — não repetido aqui. `useImoveis` (`src/lib/api/hooks/use-imoveis.ts`) já suporta os filtros `disponivel_aluguel`/`disponivel_venda`; `PropertyCard`/`toPropertyDisplayData` já existem; `buildWhatsappHref` (`src/lib/whatsapp.ts`) já existe; o padrão de formulário de busca (campo de local + tipo de operação + submit navegando pra `/busca`) já existe em `src/app/_home/Hero.tsx`; os parâmetros aceitos por `/busca` já estão documentados em `src/app/busca/filters.ts`.

## Goals / Non-Goals

**Goals:**
- As 3 páginas com mockup real ficam navegáveis e fiéis ao design.
- Imóveis em destaque são sempre dados reais da API.

**Non-Goals:**
- Rotas do Footer sem mockup (Ajuda, Garantia, Gestão, Bairros, Trabalhe conosco) — fora de escopo, ver proposal.md.
- Seção de equipe na página Sobre — omitida, ver proposal.md.
- CMS ou qualquer forma de editar esse conteúdo fora do código.

## Decisions

**1. Formulário de busca de `/alugar` e `/comprar` reaproveita a mesma lógica de `Hero.tsx` (campo de local + `useRouter().push()` pra `/busca` com o parâmetro `operacao` fixo), mas como um componente próprio de cada página — não uma extração genérica do `Hero` compartilhada.**
O `Hero` da Home tem os dois botões de tipo de operação (aluguel/compra) alternáveis; aqui a operação já vem fixa pelo contexto da página (`/alugar` sempre busca aluguel, `/comprar` sempre busca compra), então o componente é mais simples — extrair uma abstração compartilhada agora seria prematuro para duas variações pequenas e específicas.

**2. Atalhos de filtro rápido do `/alugar` (Studio, 1 quarto, 2 quartos, Mobiliado, Aceita pets) mapeados pros parâmetros reais de `/busca`: "Studio" → `quartos=0`, "1 quarto"/"2 quartos" → `quartos=1`/`quartos=2`, "Mobiliado" → `mobiliado=true`, "Aceita pets" → `aceita_pets=true`, todos com `operacao=aluguel`.**
Mesmo vocabulário de filtros já usado em `CategoryShortcuts.tsx` (Home) e em `filters.ts`.

**3. Imóveis em destaque: `useImoveis({ disponivel_aluguel: true, limit: 2 })` em `/alugar` e `useImoveis({ disponivel_venda: true, limit: 2 })` em `/comprar`, renderizados com `PropertyCard` via `toPropertyDisplayData` — mesmo padrão já usado em `SelecionadosParaHoje.tsx` (Home).**
Estados de carregamento/erro/vazio seguem o mesmo padrão já estabelecido (skeleton, mensagem de erro, mensagem de lista vazia) — não uma implementação nova.

**4. Texto de horário de atendimento do card de simulação de financiamento (`/comprar`) é omitido — o mockup mostra um horário fixo ("Seg a sáb, 8h às 20h") que não foi confirmado como real.**
Mantém o botão "Simular no WhatsApp" e o checklist (conteúdo informativo genérico, não uma alegação factual sobre disponibilidade), mas não inventa um horário de atendimento específico não confirmado.

**5. Seção "Antes de alugar"/"Antes de comprar": os 3 itens de cada uma são exibidos como texto estático (título + descrição curta), sem link/página de detalhe própria nesta v1 — cada item não é clicável.**
O mockup não mostra pra onde esses itens levariam (não há uma "página do artigo"); criar páginas de conteúdo vazias ou links quebrados seria pior do que não ter link nenhum. Se o site ganhar um blog/central de ajuda no futuro, esses itens podem virar links de verdade.

**6. Cada página é uma rota própria (`src/app/alugar/page.tsx`, `src/app/comprar/page.tsx`, `src/app/sobre/page.tsx`), sem componente de layout compartilhado entre elas além do que o root layout (Header/Footer) já dá — nenhuma abstração "página institucional genérica" criada agora.**
Mesmo raciocínio da decisão 1: três páginas com conteúdo e estrutura parecida, mas pequena o suficiente pra não justificar uma abstração compartilhada ainda.

## Risks / Trade-offs

- **[Trade-off] Seção "Antes de alugar/comprar" sem link nenhum** → Aceito conscientemente (decisão 5); melhor que um link quebrado.
- **[Risco] Duas páginas (`/alugar`, `/comprar`) fazendo buscas `/imoveis` separadas com filtros diferentes, além da Home e da Busca** → Aceito; é o mesmo padrão (`useImoveis`) já usado em 2 lugares, TanStack Query cacheia por chave de filtro, sem custo extra de implementação.
