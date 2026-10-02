## Why

Hoje a página inicial do painel só lista imóveis `publicado` (usa a busca pública), então a equipe não consegue gerenciar imóveis pausados, em análise ou removidos a não ser digitando o ID — e, mesmo assim, o painel oferece "Aprovar/Pausar/Rejeitar" para qualquer status, e a API recusa a maioria. O back-end já entregou (em produção desde 02/10/2026) a listagem administrativa `GET /admin/imoveis` (todos os status, filtros, paginação), a ação nova `republicar` (pausado → publicado) e o campo `acoes_permitidas` em cada item, que diz exatamente quais ações valem para o imóvel naquele momento.

## What Changes

- A página inicial do painel (`/admin`) passa a listar imóveis de **todos os status**, paginada, com filtros por status, por corretor (inclusive "sem corretor") e busca por texto, e ordenação por mais novos / mais antigos.
- Cada imóvel da lista oferece as ações de publicação **exatamente** as que a API permite (`aprovar`, `pausar`, `rejeitar`, `republicar`), sem o front reimplementar a regra. Um imóvel pausado cuja unidade já tem outro anúncio ativo aparece sem ação, com a explicação.
- Pausar e rejeitar pedem confirmação; pausar avisa quando a unidade tem visitas agendadas futuras (elas continuam marcadas, mas ninguém mais consegue reservar horários).
- O corretor atribuído a cada imóvel é exibido na lista e pode ser trocado ou removido ali mesmo (reaproveitando o seletor já existente).
- Erros das ações são explicados em português a partir do `error.code` (`transicao_invalida` recarrega a lista; `unidade_ja_tem_anuncio_ativo` explica o conflito).
- **BREAKING (comportamento):** a tela de detalhe `/admin/imoveis/{id}` deixa de oferecer os botões Aprovar/Pausar/Rejeitar — o detalhe da API não traz `acoes_permitidas`, então as ações passam a ser feitas na lista. O detalhe continua exibindo os dados, o status e o seletor de corretor, e ganha um link de volta para a lista.

## Capabilities

### Modified Capabilities
- `admin-panel`: a lista de imóveis passa a cobrir todos os status com filtros e ações de publicação conforme `acoes_permitidas` (incluindo republicar); atribuição de corretor também disponível na lista; o detalhe deixa de ter os botões de moderação.
- `mobile-access`: as ações de publicação da lista de imóveis do painel entram na regra de 44px de área de toque.

## Impact

- `src/app/admin/page.tsx` (lista), novos componentes em `src/app/admin/_components/`, `src/app/admin/imoveis/[imovelId]/page.tsx` (remove botões de moderação).
- Novos hooks sobre `GET /admin/imoveis` e `POST /imoveis/{id}/republicar`; `use-moderar-imovel` passa a invalidar a lista administrativa; `use-atribuir-corretor-imovel` também.
- Tipos da API já regenerados (`npm run api:types`).
- Nenhum código do front depende do antigo `error.code: "http_error"` nas condições que o back-end trocou, então a mudança de códigos não quebra nada.
