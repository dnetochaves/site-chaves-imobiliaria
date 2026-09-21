## 1. Tipos e módulo de erro

- [x] 1.1 Rodar `npm run api:types` e rodar `npx tsc --noEmit`; corrigir qualquer erro de tipo causado pelo novo schema (confirmar que `ErrorResponse` existe e `HTTPValidationError` saiu)
- [x] 1.2 Criar `src/lib/api/errors.ts` com `ApiError` e `toApiError(error, response)` (corpo no formato novo, corpo fora do formato, `Retry-After` inválido ou ausente); verificar com um script/harness temporário que os 3 casos produzem o `ApiError` esperado
- [x] 1.3 Criar `describeApiError(error)` em pt-BR (429 com e sem segundos, validation_error com `details`, genérico); verificar os mesmos casos

## 2. Hooks e retry

- [x] 2.1 Trocar `throw error` por `throw toApiError(error, response)` nos hooks `use-imoveis`, `use-imovel-detail` (mantendo `ImovelNaoEncontradoError` no 404), `use-create-lead`, `use-create-imovel`, `use-favoritos` (2 lugares) e `use-health-check`; `tsc` limpo
- [x] 2.2 Configurar o `retry` do `QueryClient` em `providers.tsx` para não re-tentar `ApiError` 4xx; verificar que um 4xx aparece como erro de imediato e que falha de rede ainda re-tenta

## 3. Interface

- [x] 3.1 Substituir `({String(error)})` por `describeApiError(error)` nas 6 telas de lista (`comprar`, `alugar`, `favoritos`, `SelecionadosParaHoje`, `SearchResultsList`, `PropertyListing`)
- [x] 3.2 Mostrar `describeApiError(error)` nos blocos de erro de `ListPropertyForm` e `ContactRequestDialog`, mantendo o texto atual como fallback

## 4. Verificação

- [x] 4.1 No browser, provocar um 422 real (ex.: `GET /imoveis?tipo=xyz`) e conferir que o erro chega como `ApiError` com `code` e `details`; simular o 429 com uma página de debug temporária (removida depois) e conferir a mensagem com e sem tempo de espera
- [x] 4.2 Conferir que Home, `/busca`, `/alugar`, `/comprar`, detalhe e `/favoritos` continuam funcionando com dados normais e que "imóvel não encontrado" (`/imoveis/999999`) ainda mostra o estado correto; `tsc` e `eslint` limpos
