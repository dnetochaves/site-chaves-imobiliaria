## Why

Já existe favoritar de verdade (`add-property-detail`), mas nenhum lugar do site mostra pro usuário o que ele favoritou. O coração na página de detalhe funciona, mas não tem pra onde "ir depois".

## What Changes

- Nova rota `/favoritos`: lista os imóveis favoritados do usuário autenticado, usando `GET /favoritos`.
- Cada item permite remover o favorito direto da lista.
- Itens cujo imóvel ainda tem um anúncio ativo (`imovel_atual` presente) navegam pra página de detalhe; itens sem anúncio ativo (`imovel_atual: null` — anúncio pausado/removido depois de favoritado) são exibidos de forma não-navegável, com indicação clara disso.
- Acesso exige autenticação: usuário não autenticado que acessa `/favoritos` é levado a fazer login.
- Header ganha um link pra `/favoritos`, visível só quando autenticado.

## Capabilities

### New Capabilities
- `favorites-page`: página que lista, exibe e permite remover os favoritos do usuário autenticado.

### Modified Capabilities
- `site-shell`: o header ganha um link de navegação pra `/favoritos`, visível apenas quando o usuário está autenticado.

## Impact

- Novo `src/app/favoritos/page.tsx` (e componentes de suporte).
- `src/components/shell/Header.tsx` ganha o novo link.
- Reaproveita `useFavoritos`/`useToggleFavorito` (`add-property-detail`) e `AuthContext` (`add-authentication`) já existentes — nenhuma mudança nesses arquivos além do que for necessário pra reutilização.
