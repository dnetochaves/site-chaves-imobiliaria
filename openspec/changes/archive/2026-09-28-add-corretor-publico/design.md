## Context

O painel já tem um módulo completo de corretores (`add-admin-corretores`, arquivado): CRUD staff-only, hooks TanStack Query, `CorretorFormulario`/`CorretorLinha`/`CorretorSeletor`. O backend acrescentou, sobre essa mesma base, um endpoint público (`GET /corretores/publico/{slug}`, sem auth) e os campos `slug`, `bio`, `cidade`, `redes_sociais` ao cadastro existente. Ver proposal.md - Why.

A página de imóvel já tem um padrão de página pública consolidado (`/imoveis/[imovelId]/page.tsx` + `_components/`), com `ShareButton` (Web Share API + fallback de copiar link) e `src/lib/whatsapp.ts` para links de WhatsApp — ambos reaproveitáveis aqui.

## Goals / Non-Goals

- **Goal**: página pública rápida de carregar e assets mínimos — é o tipo de página que abre num link de WhatsApp, geralmente em 4G.
- **Goal**: nunca exibir campo vazio como se fosse um dado — omitir, não substituir por texto genérico.
- **Non-Goal**: SEO avançado (metadata dinâmica, OG image gerada) fica fora desta entrega; a página só precisa funcionar e ser compartilhável por link.
- **Non-Goal**: qualquer edição de perfil pelo próprio corretor (ele não tem login) — toda edição continua sendo staff, pelo painel.

## Decisions

### Reaproveitar `ShareButton` como está
`src/app/imoveis/[imovelId]/_components/ShareButton.tsx` já implementa exatamente o comportamento pedido (Web Share API com fallback de copiar link). Em vez de duplicar, ele é movido para um local compartilhado (`src/components/ShareButton.tsx`) e a página de imóvel passa a importar dali — mesmo componente, sem duplicação.

### Nova função de WhatsApp com mensagem pré-preenchida
`buildLeadWhatsappHref(telefone)` valida o telefone mas não aceita mensagem. Acrescenta-se `buildWhatsappHrefForPhone(telefone, mensagem)` em `src/lib/whatsapp.ts`, reaproveitando a mesma lógica de normalização de telefone (dedup: extrair a validação de dígitos para uma função interna compartilhada pelas duas).

### Hook de leitura pública, sem token, com erro 404 tratado como "não encontrado"
`useCorretorPublico(slug)` sobre `GET /corretores/publico/{slug}`, seguindo o mesmo padrão de `useImovelDetail`/`ImovelNaoEncontradoError`: uma classe `CorretorNaoEncontradoError` para o 404 (sem tentar diferenciar slug inexistente de corretor inativo — a API já garante isso), sem retry nesse caso. Como a rota é pública, esse hook nunca deve depender de `getTokens()` retornar algo — o `apiClient` já anexa o header só quando há token, então a chamada funciona igual, logado ou não.

### `redes_sociais` como objeto plano, sem lista genérica de redes
O backend só aceita `instagram` e `linkedin` por enquanto (chave desconhecida é 422). O formulário admin e a página pública tratam essas duas redes como campos nomeados, não como uma lista iterável — evita ter que validar chaves no cliente. Quando o backend expandir o conjunto, os dois lugares precisam de um ajuste pontual (aceitável, dado que o próprio backend avisou que isso é aditivo).

### Slug: somente leitura na criação, editável na edição
`CorretorFormulario` já é um único componente para criar e editar (`corretor: Corretor | null`). O campo de slug só aparece no modo edição (`corretor !== null`), como um input de texto com o valor atual, reaproveitando o mesmo padrão de erro de campo já usado para CRECI (`describeCorretorError`, que ganha um novo `campo: "slug"` possível a partir do 409).

### Link do corretor na página de imóvel: no sidebar de preço
`PropertyPriceSidebar` já concentra as ações que dependem de "com quem falar sobre este imóvel" (agendar visita, solicitar contato, falar com a Chaves). O link "Corretor responsável: {nome}" entra ali, logo abaixo dessas ações, apontando para `/corretores/{imovel.corretor.slug}` — só quando `imovel.corretor` existir (o campo já vem de `GET /imoveis/{id}` com `slug`).

## Risks / Trade-offs

- [A página pública falha silenciosamente se o backend um dia parar de anexar `slug` a `CorretorRef`] → o link na página de imóvel e o link "Ver card público" no painel só aparecem quando `corretor` (ou `corretor.slug`) existe; sem isso, simplesmente não há link, sem quebrar a página.
- [Mover `ShareButton` de lugar pode ter algum efeito colateral se algo mais importar do caminho antigo] → busca por importações do arquivo antes de mover, ajusta o único import conhecido (`imoveis/[imovelId]/page.tsx`).

## Migration Plan

Nenhuma migração de dados — o endpoint e os campos já estão em produção. Implementação e deploy direto, sem flag.
