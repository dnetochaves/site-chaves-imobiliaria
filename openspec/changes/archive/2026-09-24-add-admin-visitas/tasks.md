## 1. Base compartilhada

- [x] 1.1 Criar `src/lib/visita-labels.ts` com `VisitaStatus` e `VISITA_STATUS_OPTIONS` (rótulos em português, tipados a partir do schema); verificar `tsc` limpo
- [x] 1.2 Em `src/app/admin/layout.tsx`, adicionar o link "Visitas" (→ `/admin/visitas`) e reescrever a lógica da seção ativa de forma explícita (prefixos por seção: Imóveis = `/admin` exato e `/admin/imoveis`; Leads; Visitas), verificando que cada seção fica ativa só nas suas rotas; `tsc`/`eslint` limpos

## 2. Hooks de API

- [x] 2.1 Criar `useCriarHorarioVisita()` em `src/lib/api/hooks/use-criar-horario-visita.ts` (`POST /visitas`, `useMutation` + `toApiError`)
- [x] 2.2 Criar `useAtualizarVisita()` em `src/lib/api/hooks/use-atualizar-visita.ts` (`POST /visitas/{visita_id}/cancelar|concluir`, ação e ID passados em `mutate`, `useMutation` + `toApiError`); verificar `tsc` limpo

## 3. Tela de visitas

- [x] 3.1 Criar `src/app/admin/visitas/page.tsx` com as duas seções
- [x] 3.2 Seção "Criar horário": campo de ID do imóvel (inteiro positivo), busca via `useImovelDetail` só após confirmar o ID, exibição de título/endereço ou "Imóvel não encontrado", `datetime-local` obrigatório, observações opcionais, envio com `new Date(valor).toISOString()` e `unidade.id`, botão desabilitado durante o envio, dados mantidos no erro, confirmação com ID da visita, data/hora em pt-BR e status
- [x] 3.3 Seção "Cancelar ou concluir visita": campo de ID (inteiro positivo, mensagem para inválido), botões "Cancelar visita" e "Concluir visita" desabilitados durante a ação, resultado com ID/data-hora/status, 404 → "Visita não encontrada", demais erros em português via `describeApiError`

## 4. Verificação

- [x] 4.1 No browser, com proxy de teste (simula `/auth/me` staff, `POST /visitas` com sucesso, cancelar/concluir com sucesso, 404 e recusa simulada; repassa `GET /imoveis/{id}` à produção), verificar: navegação e seção ativa nas três seções (inclusive em `/admin/imoveis/{id}`), ID inválido, imóvel encontrado/não encontrado, data obrigatória, criação com sucesso e confirmação, erro na criação mantendo os dados, botão desabilitado durante o envio, cancelar/concluir com sucesso, visita não encontrada, recusa da API e ID inválido; restaurar `.env.local` e parar o proxy ao final
- [x] 4.2 Confirmar que um usuário não-staff continua vendo 404 em `/admin/visitas`
- [x] 4.3 `tsc` e `eslint` limpos no projeto todo; registrar no relatório o que só o usuário pode confirmar com conta staff real (regras de transição e permissões do backend, fuso horário do horário criado)
