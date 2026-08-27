## Context

Ver [proposal.md](proposal.md) para o porquê. `GET /favoritos` (`FavoritoRead[]`: `{ id, unidade: UnidadeRead, imovel_atual?: ImovelSummary | null }`) e `DELETE /favoritos/{unidade_id}` já são usados por `useFavoritos`/`useToggleFavorito` (`src/lib/api/hooks/use-favoritos.ts`, `add-property-detail`). `AuthContext` (`src/lib/auth/AuthContext.tsx`) expõe `status`/`login`. Não há mockup pra essa página no design_system — o layout segue os padrões visuais já estabelecidos no projeto.

## Goals / Non-Goals

**Goals:**
- Ver e remover favoritos num só lugar.
- Lidar corretamente com um favorito cujo anúncio não está mais ativo (`imovel_atual: null`).

**Non-Goals:**
- Mudar `FavoriteButton.tsx`/a página de detalhe.
- Paginação, ordenação ou filtros da lista (a API não pagina esse endpoint).

## Decisions

**1. Layout em lista (reaproveitando o padrão visual de `PropertyListItem`, não o grid do `PropertyCard`).**
É uma lista pessoal de gerenciamento (com ação de remover por item), não uma vitrine — o layout de lista compacta com uma ação clara à parte combina melhor do que o grid de card usado em contextos de descoberta (Home/Busca).

**2. Novo componente `src/app/favoritos/_components/FavoritoItem.tsx`, não reaproveita `PropertyListItem.tsx` diretamente.**
`PropertyListItem` inteiro é um `<Link>` (decisão do `add-property-detail`) — colocar um botão de remover funcional dentro de um `<a>` aninhado é inválido em HTML e frágil (cliques no botão también disparam a navegação do link, exigindo `preventDefault`/`stopPropagation` cuidadosos). `FavoritoItem` usa a mesma linguagem visual (thumbnail + dados), mas com o link (quando houver `imovel_atual`) e o botão de remover como elementos irmãos lado a lado, não aninhados — mais simples e robusto. Quando não há `imovel_atual`, o item não é envolto em link nenhum (só texto + botão de remover).

**3. Remoção usa `useToggleFavorito(unidade)` (já existe, mutação otimista) chamado com `toggle()` direto — sem exigir um novo diálogo de confirmação.**
Remover um favorito é uma ação de baixo risco e reversível (basta favoritar de novo); reaproveita a mesma mutação otimista já testada no `add-property-detail`, sem necessidade de confirmação extra.

**4. Página em `src/app/favoritos/page.tsx`: usuário `status !== "authenticated"` chama `login()` diretamente ao montar (sem renderizar a lista), igual ao padrão já usado pro coração de favoritar na página de detalhe.**
`status === "loading"` (validação inicial de sessão ainda em andamento) exibe um estado de carregamento neutro até resolver, evitando disparar `login()` prematuramente pra alguém que na verdade já tem sessão válida.

**5. Header ganha o link "Favoritos" entre a navegação principal e a ação de conta, visível só quando `status === "authenticated"` — sem virar um menu dropdown (mantém a simplicidade já decidida no `add-authentication`).**

## Risks / Trade-offs

- **[Trade-off] Novo componente de item em vez de reaproveitar `PropertyListItem`** → Aceito; evita a fragilidade de um botão interativo aninhado dentro de um link, ao custo de duplicar um pouco de markup visual (mesma linguagem de design, componente diferente).
