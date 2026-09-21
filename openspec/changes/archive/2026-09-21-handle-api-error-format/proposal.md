## Why

O back-end publicou um formato único de erro para toda a API: `{ "error": { "code", "message", "details": [{ "field", "message" }] } }`. O 429 (limite de requisições) passou a seguir o mesmo formato (antes `error` era texto puro) e traz o header `Retry-After`. O tipo `HTTPValidationError` do OpenAPI foi substituído por `ErrorResponse`.

Hoje o frontend lança o corpo cru do erro e as telas de lista mostram `({String(error)})`, o que vira "[object Object]". Os formulários (`/anunciar` e pedido de contato) ignoram o erro da API e mostram só um texto fixo. É a única parte do aviso do back-end que pode quebrar algo, por isso vem antes das demais (fotos nos cards, filtros de busca, tipo do imóvel, domínio).

## What Changes

- Novo `ApiError` (status, code, message, details, retryAfterSeconds) e conversão do erro do client para ele, tolerando respostas fora do formato (ex.: 502 não-JSON).
- Todos os hooks de API passam a lançar `ApiError` em vez do corpo cru (o 404 do detalhe continua virando `ImovelNaoEncontradoError`).
- Mensagens amigáveis em pt-BR para o usuário: 429 com o tempo de espera (`Retry-After`), erros de validação com as mensagens por campo, e mensagem genérica para o resto. Texto cru do back-end (em inglês) não é exibido.
- As 6 telas de lista deixam de mostrar `String(error)`; os formulários de cadastro de imóvel e de pedido de contato mostram o motivo real do erro.
- O QueryClient deixa de re-tentar automaticamente erros 4xx (incluindo 429).
- Tipos do client regenerados com `npm run api:types` (traz `ErrorResponse` e também os campos que as próximas changes usam).

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `typed-api-client`: o requisito "Estado de requisições de dados" passa a exigir que o erro exposto aos componentes seja estruturado (status, código, mensagem, detalhes por campo), e ganha um cenário para o limite de requisições (429) com tempo de espera.

## Impact

- `src/lib/api/errors.ts` (novo), `src/lib/api/hooks/*` (6 hooks), `src/app/providers.tsx` (retry).
- Telas: `comprar`, `alugar`, `favoritos`, `_home/SelecionadosParaHoje`, `busca/_components/SearchResultsList`, `components/property/PropertyListing`, `anunciar/_components/ListPropertyForm`, `imoveis/[imovelId]/_components/ContactRequestDialog`.
- `src/lib/api/generated/schema.ts` regenerado a partir da API de produção.
- Sem mudança visual além das mensagens de erro.
