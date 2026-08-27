## Context

Ver [proposal.md](proposal.md) para o porquê. A API já expõe tudo que a página precisa (`GET /imoveis/{imovel_id}` → `ImovelDetail`, `GET /favoritos`, `POST`/`DELETE /favoritos/{unidade_id}`, `POST /leads`), confirmado em `src/lib/api/generated/schema.ts`. O projeto já tem `apiClient` (openapi-fetch + TanStack Query, ver `src/lib/api/hooks/use-imoveis.ts` como padrão de hook), `AuthContext` (`src/lib/auth/AuthContext.tsx`, expõe `status`/`login`), e um componente de mapa MapLibre (usado no change `add-search-page`).

**Limitação confirmada da API**: não existe endpoint para listar os slots de visita (`visita_id`) disponíveis de uma unidade. Só existe `POST /visitas/{visita_id}/agendar`, que exige o ID do slot de antemão, e `GET /visitas/disponiveis-em-breve`, que devolve unidades (não slots) pras próximas 48h sem expor `visita_id`. Por isso "agendar visita" nesta página não agenda um horário de verdade.

## Goals / Non-Goals

**Goals:**
- Página de detalhe funcional com todos os dados reais que a API sustenta.
- Favoritar real, com prompt de login quando necessário.
- Um jeito de pedir uma visita/contato que não dependa do endpoint de slots que falta.

**Non-Goals:**
- Agendamento real de horário de visita — bloqueado pela API (ver Context). Quando o backend expuser um endpoint de listagem de slots, isso vira um change futuro.
- Avaliações, imóveis similares, simulação de financiamento nesta página.
- SEO avançado (metadata dinâmica, structured data).

## Decisions

**1. Rota `src/app/imoveis/[imovelId]/page.tsx`, `imovelId` como string convertido pro `imovel_id` numérico esperado pela API.**
Segue a convenção de rotas dinâmicas do App Router. Um `imovelId` não numérico ou inexistente cai no mesmo estado de "não encontrado" (Requirement: Imóvel não encontrado).

**2. Busca de dados via `useImovelDetail(imovelId)` em `src/lib/api/hooks/use-imovel-detail.ts`, seguindo o padrão de `use-imoveis.ts` (TanStack Query + `apiClient.GET`).**
Um 404 da API mapeia pro estado "não encontrado"; qualquer outro erro mapeia pro estado de erro genérico.

**3. Favoritar usa `GET /favoritos` (lista completa do usuário) pra determinar o estado inicial, e `POST`/`DELETE /favoritos/{unidade_id}` pra alternar, com atualização otimista da UI.**
Não existe um endpoint "favoritos/{unidade_id}" de leitura unitária — só a lista completa. Buscar a lista completa (já pequena, é só do usuário logado) e checar se a `unidade_id` atual está nela é a forma mais simples de saber o estado inicial. Atualização otimista porque a ação é reversível e de baixo risco (idempotente nos dois sentidos, conforme a doc do endpoint). Se a chamada falhar, reverte o estado visual. Requisição só é feita se `status === "authenticated"`; caso contrário, o clique chama `login()` do `AuthContext` diretamente.

**4. "Agendar visita" abre um formulário simples (nome + telefone, pré-preenchidos com dados do usuário autenticado quando disponíveis) que envia `POST /leads` com `tipo: "contato_imovel"` e `unidade_id`.**
Nomeado "Agendar visita" no botão (mantém a linguagem do mockup, que é o que o usuário reconhece), mas o comportamento real é pedido de contato — o formulário e a confirmação deixam claro que é um pedido, não uma confirmação de horário (ex.: "Recebemos seu pedido, entraremos em contato em breve" em vez de "Visita confirmada"). Essa é a decisão consciente já registrada no proposal.md.

**5. "Falar com a Chaves" é um link `https://wa.me/{numero}?text=...` reaproveitando o mesmo `WHATSAPP_PLACEHOLDER_NUMBER` (com o mesmo TODO) já usado em `src/app/_home/CategoryShortcuts.tsx`, extraído para um util compartilhado se isso já não existir.**
Evita duplicar o placeholder em dois lugares com valores potencialmente divergentes.

**6. Mapa reaproveita o componente de mapa existente (`add-search-page`), num modo "ponto único": centralizado nas coordenadas da unidade, com um marcador, sem clustering nem sincronismo de hover (que só fazem sentido numa lista de resultados).**
Evita duplicar lógica de mapa; o componente existente precisa aceitar esse modo mais simples de uso (um ponto único) além do modo de lista de resultados que já tem.

**7. Galeria: grade com 1 foto grande + miniaturas (`ImovelDetail.fotos`, ordenadas por `ordem`), com um botão "Ver N fotos" abrindo uma visualização ampliada (lightbox) navegável entre todas as fotos.**
Sem fotos: mostra um placeholder único no lugar da galeria (mesmo princípio de fallback visual já usado no `property-listing`), sem quebrar o layout.

**8. `PropertyCard` e `PropertyListItem` ganham uma prop `id` (ou `href` já pronto) e passam a renderizar como link (`next/link`) pro `/imoveis/{id}`, sem virar `<a>` aninhado dentro de outros elementos clicáveis (o coração de favoritar dentro do card, se algum dia existir ali, precisaria de `stopPropagation` — hoje o coração nos cards de listagem é puramente decorativo, então não há conflito agora).**

## Risks / Trade-offs

- **[Risco] Usuário entende "Agendar visita" como agendamento confirmado, mas é só um pedido de contato** → Mitigação: mensagem de confirmação explícita ("entraremos em contato"), sem sugerir um horário específico já reservado.
- **[Trade-off] Favoritar via lista completa (`GET /favoritos`) em vez de um endpoint unitário** → Aceito; a lista é do usuário logado, deve ser pequena, e evita esperar por um endpoint que não existe.
- **[Risco] Atualização otimista do favorito pode reverter visualmente se a chamada falhar** → Aceito como comportamento padrão de UI otimista; mensagem de erro discreta ao reverter.
