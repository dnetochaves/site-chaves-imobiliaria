## Context

Ver [proposal.md](proposal.md) para o porquê. Não há mockup no design system pra essa página, e a API não expõe nenhum endpoint de vagas/carreiras ou de parceiros. A página é voltada a corretores de imóveis (profissionais com CRECI) interessados em parceria com a Chaves — não a candidatos a emprego CLT. `buildWhatsappHref` (`src/lib/whatsapp.ts`) e o padrão visual de página institucional simples (label + título + subtítulo + seção final com CTA) já existem, usados em `/sobre` e `/garantia`.

## Goals / Non-Goals

**Goals:**
- Página `/trabalhe-conosco` navegável, clara sobre ser voltada a corretores parceiros (não emprego CLT).
- Cobrir os formatos de parceria já confirmados pelo usuário: venda/locação dos imóveis da Chaves e administração/gestão de condomínios.
- Oferecer um jeito real de iniciar contato, sem sugerir um processo seletivo formal que não existe.

**Non-Goals:**
- Lista de vagas abertas, formulário de candidatura, upload de currículo — nenhuma fonte de dado real pra isso.
- Um "programa de parceria" estruturado com etapas/requisitos formais não confirmados — não inventar.
- Benefícios/comissionamento detalhados não confirmados — não inventar números.
- As outras páginas do Footer sem mockup ainda pendentes (Ajuda, Gestão).

## Decisions

**1. Conteúdo focado em "corretor parceiro", não em "carreira"/"emprego": título e subtítulo deixam claro que a página é sobre parceria com corretores, cobrindo os dois formatos já confirmados (venda/locação dos imóveis da Chaves, administração/gestão de condomínios) mais uma menção genérica a "outros formatos de parceria".**
Sem seção de "vagas abertas" nem de "benefícios" detalhados — só o convite e os formatos de parceria que o usuário efetivamente confirmou. Mesmo princípio já aplicado em outras páginas institucionais (nunca inventar um dado/alegação que não foi confirmado), aplicado aqui ao contexto certo: parceria com corretores, não vagas de emprego.

**2. Contato via `buildWhatsappHref` com uma mensagem própria voltada a corretores (ex.: "Sou corretor e quero ser parceiro da Chaves") — mesmo mecanismo já usado em `/comprar`.**
Não introduz nenhum canal de contato novo (e-mail, formulário) — reaproveita o único canal de contato direto que o site já tem.

**3. Página em `src/app/trabalhe-conosco/page.tsx`, sem componente de layout compartilhado com `/sobre`/`/garantia` — mesmo raciocínio já registrado nesses changes (páginas pequenas, abstração prematura).**

## Risks / Trade-offs

- **[Trade-off] Página bem enxuta, sem detalhar comissionamento/condições da parceria** → Aceito conscientemente; é a alternativa honesta a inventar condições não confirmadas — os detalhes ficam pra serem combinados na conversa via WhatsApp.
