## Context

`apiClient` (openapi-fetch) devolve `{ data, error, response }`. Hoje cada hook faz `if (error) throw error;`, lançando o corpo cru. As telas usam `String(error)` ou textos fixos. O `QueryClient` é criado sem opções em `providers.tsx` (retry padrão do TanStack Query: 3 tentativas para queries, 0 para mutations). Ver proposal.md para a motivação.

## Goals / Non-Goals

**Goals:**
- Um único ponto que converte qualquer falha da API em um erro estruturado (`ApiError`).
- Mensagens pt-BR consistentes para o usuário, em um único helper.
- Não re-tentar 4xx (principalmente 429) automaticamente.

**Non-Goals:**
- Marcar visualmente cada input com erro (só listar as mensagens dos `details` no bloco de erro existente).
- Contagem regressiva ao vivo do `Retry-After` (só o número na mensagem).
- Refresh automático de token em 401 (issue #2 do GitHub, separada).

## Decisions

### 1. `ApiError` + função de conversão em `src/lib/api/errors.ts`
`ApiError extends Error` com `status`, `code`, `message`, `details: { field: string; message: string }[]` e `retryAfterSeconds: number | null`. A função `toApiError(error, response)` lê `error.error.{code,message,details}` quando o corpo tem esse formato e, caso contrário, cai em `code: "unknown_error"` com mensagem genérica (cobre 502/HTML de proxy e corpo vazio). `Retry-After` é lido de `response.headers` e só vale se for inteiro não negativo (o formato de data HTTP é ignorado, porque o back-end envia segundos).

Alternativa descartada: um middleware `onResponse` no `apiClient` que lança direto. Rejeitada porque o openapi-fetch devolve `error` tipado por endpoint e os hooks já tratam `error`; converter no hook mantém o fluxo atual e o caso especial do 404 do detalhe.

### 2. Hooks lançam `ApiError`
Os 6 hooks trocam `throw error` por `throw toApiError(error, response)`. `use-imovel-detail` mantém `ImovelNaoEncontradoError` para 404 antes de converter.

### 3. `describeApiError` (pt-BR) para a interface
Retorna texto pronto para o usuário: 429 → "Muitas tentativas. Tente de novo em N segundos." (sem "N" se não houver `retryAfterSeconds`); qualquer outro erro → o texto de fallback da própria tela. O texto em inglês do back-end (`message`) nunca é exibido. Erros de validação só mostram as mensagens de `details` quando o chamador pede (`showValidationDetails`), o que só os formulários fazem.

Revisado durante a implementação: a primeira versão mostrava os `details` em qualquer tela. Testando um 422 real pela busca (`/busca?preco_min=abc`) apareceu "Input should be a valid decimal" (mensagem em inglês do back-end) numa tela de lista, onde o usuário não consegue corrigir nada. Por isso virou opt-in.

### 4. Telas
As 6 listas trocam `({String(error)})` por `describeApiError(error, <mensagem da tela>)`. `ListPropertyForm` e `ContactRequestDialog` fazem o mesmo com `showValidationDetails: true`, no bloco de erro que já existe.

### 5. Retry do `QueryClient`
`defaultOptions.queries.retry`: não tentar de novo quando o erro é `ApiError` com status 4xx; nos demais casos manter até 3 tentativas. O `retry` próprio de `use-imovel-detail` continua valendo para ele.

### 6. Regenerar tipos
`npm run api:types` a partir da produção. Verificar com `tsc`/`eslint` se algum código existente quebra com o novo schema; corrigir o que aparecer.

## Risks / Trade-offs

- [As mensagens de `details` do back-end vêm em inglês (mensagens do pydantic)] → Só aparecem nos formulários (que já validam no cliente, então o caso é raro). Se ficar ruim, mapear por `field` para textos em pt-BR depois.
- [A regeneração dos tipos puxa mudanças de outras features (foto_capa, tipo, filtros)] → Só adiciona campos opcionais; o `tsc` confirma que nada existente quebra. Elas ficam sem uso até as próximas changes.
