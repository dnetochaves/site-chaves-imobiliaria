## Why

Os cards de imóvel na Home e na Busca não têm pra onde ir — não existe uma página que mostre o imóvel inteiro (galeria, descrição, características, localização, preço detalhado) nem uma forma de favoritar de verdade ou pedir uma visita. Com a autenticação já funcionando (`add-authentication`), dá pra construir essa página com dados e ações reais em vez de mocks.

## What Changes

- Nova rota `/imoveis/[imovelId]` com o detalhe completo do imóvel: galeria de fotos, título/endereço/specs, descrição, características (amenidades), localização num mapa real, e um sidebar fixo com o detalhamento do preço mensal.
- Favoritar real (`POST`/`DELETE /favoritos/{unidade_id}`), com estado inicial checado contra `GET /favoritos`; usuário não autenticado que clica no coração é redirecionado pro login.
- Botão "Agendar visita" que envia um pedido de contato via `POST /leads` (`tipo: contato_imovel`) — **não** é agendamento real de horário, porque a API não expõe nenhum jeito de listar os slots de visita disponíveis de uma unidade (só existe `POST /visitas/{visita_id}/agendar`, que já exige saber o ID do slot de antemão). Ver design.md pra decisão detalhada.
- Botão "Falar com a Chaves" como link de WhatsApp, reaproveitando o padrão/placeholder já usado em `CategoryShortcuts.tsx`.
- `PropertyCard` (Home) e `PropertyListItem` (Busca) passam a linkar pra essa nova rota — hoje os cards não são clicáveis.

## Capabilities

### New Capabilities
- `property-detail`: página de detalhe do imóvel — galeria, informações, características, localização, preço detalhado, favoritar e pedido de visita/contato.

### Modified Capabilities
- `property-listing`: os cards de imóvel (grade e lista) passam a ser clicáveis, navegando pro detalhe do imóvel correspondente.

## Impact

- Novo diretório de rota `src/app/imoveis/[imovelId]/`.
- `src/components/property/PropertyCard.tsx` e `src/components/property/PropertyListItem.tsx` ganham um `id`/link de navegação.
- Reaproveita `apiClient` (`GET /imoveis/{imovel_id}`, `GET/POST/DELETE /favoritos*`, `POST /leads`), `AuthContext` (favoritar/login) e o componente de mapa (MapLibre) já existentes.
- Nenhuma mudança no backend é necessária pro escopo deste change (o gap de listagem de slots de visita fica documentado como limitação conhecida, não bloqueia a entrega).
