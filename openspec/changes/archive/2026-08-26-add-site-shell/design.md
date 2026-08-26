## Context

Ver [proposal.md](proposal.md) para o porquê. `src/app/layout.tsx` hoje só renderiza `{children}` dentro de `<Providers>`, sem nenhum shell visual. O projeto já tem `Button` (shadcn/ui, remapeado pros tokens de marca) e os tokens de cor/tipografia de `design-system-theming`.

## Goals / Non-Goals

**Goals:**
- Header e footer visualmente fiéis ao mockup do Ciclo 03, presentes em toda página via `layout.tsx`.
- Comportamento em mobile que não quebra o layout, mesmo sem menu hambúrguer completo.

**Non-Goals:**
- Menu mobile/hambúrguer funcional (fica para um change futuro se for necessário).
- Qualquer destino de rota real por trás dos links (todos 404 por ora).
- Autenticação real.
- Revisão do conteúdo da própria Home (change seguinte).

## Decisions

**1. Header e Footer como componentes de `src/components/shell/`, renderizados direto em `layout.tsx`.**
Não viram parte de nenhuma capability específica de página (Home, Busca, etc.) — são shell compartilhado. Alternativa considerada: renderizar dentro de cada página individualmente — descartada por duplicar código e arriscar inconsistência entre páginas.

**2. Comportamento mobile do header (abaixo de `md`, 768px): esconder os links de navegação centrais (Alugar/Comprar/Anunciar/Ajuda) e o link "Entrar", mantendo só a logo à esquerda e o botão "Criar conta" à direita.**
O mockup só mostra a versão desktop; não há um menu hambúrguer especificado. Em vez de inventar uma interação não especificada (hambúrguer com painel lateral, etc.), a decisão mínima e não-quebrada é reduzir o header ao essencial em telas estreitas. Alternativa considerada: implementar um menu hambúrguer completo — descartada por ser escopo não especificado pelo Design System; fica para um change futuro caso o usuário queira.

**3. Rotas placeholder dos links seguem convenção kebab-case simples**, ex.: `/alugar`, `/comprar`, `/anunciar`, `/entrar`, `/criar-conta`, `/garantia`, `/gestao`, `/sobre`, `/trabalhe-conosco`, `/ajuda`, `/bairros`. Nenhuma dessas rotas existe ainda — 404 é esperado e consistente com a decisão já tomada para `/busca`.

**4. Footer usa dados fictícios do mockup (CRECI 00000-J, CNPJ 00.000.000/0001-00) como placeholder de texto**, já que são valores de exemplo do Design System, não dados reais da empresa. Isso deve ser trocado pelos dados reais antes de qualquer deploy de produção — sinalizado como comentário no componente.

## Risks / Trade-offs

- **[Risco] Dados fictícios de CRECI/CNPJ no footer poderiam ser confundidos com dados reais** → Mitigação: comentário explícito no código (`Footer.tsx`) marcando como placeholder do Design System, a substituir antes de produção.
- **[Trade-off] Header mobile reduzido (sem hambúrguer) limita a navegação em telas pequenas** → Aceito por ora; o Design System não especificou esse comportamento, e inventar uma interação completa está fora do escopo deste change.

## Open Questions

Nenhuma pendente que afete specs, abordagem ou tasks deste change.
