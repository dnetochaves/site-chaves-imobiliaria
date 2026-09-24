## 1. Base compartilhada

- [x] 1.1 Criar `src/lib/lead-labels.ts` com `LEAD_STATUS_OPTIONS` e `LEAD_TIPO_OPTIONS` (rótulos em português, tipados a partir do schema); verificar `tsc` limpo
- [x] 1.2 Adicionar `buildLeadWhatsappHref(telefone)` em `src/lib/whatsapp.ts` (com "+" → dígitos como estão; senão só dígitos: 10–11 → prefixa 55; 12–13 começando em 55 → como está; senão `null`); verificar com casos reais de formato (`(71) 98391-7864`, `71983917864`, `+55 71 98391-7864`, `123`, texto sem dígitos) via script/`tsc` e revisão

## 2. Hooks de API

- [x] 2.1 Criar `useLeads({status, tipo, limit, offset})` em `src/lib/api/hooks/use-leads.ts` (`useQuery`, chave `["leads", params]`, `toApiError`)
- [x] 2.2 Criar `useAtualizarStatusLead(leadId)` em `src/lib/api/hooks/use-atualizar-status-lead.ts` (`PATCH /leads/{lead_id}/status`, `useMutation` + `toApiError`, invalida `["leads"]` no sucesso); verificar `tsc` limpo

## 3. Telas

- [x] 3.1 Em `src/app/admin/layout.tsx`, adicionar a navegação "Imóveis" / "Leads" com destaque da seção ativa (`usePathname`)
- [x] 3.2 Criar `src/app/admin/leads/page.tsx`: filtros de status e tipo (com "Todos"), contagem total, lista paginada com estados carregando/erro/vazio; mudar filtro volta à página 1
- [x] 3.3 Na lista, cada lead mostra nome, telefone, tipo, status, contexto e unidade (quando houver), com `Select` de status (desabilitado durante a mutação, erro em português na linha, status mantido no erro) e o atalho de WhatsApp (só quando `buildLeadWhatsappHref` retorna link)

## 4. Verificação

- [x] 4.1 No browser, com o proxy de teste que simula `/auth/me` (staff) e `/leads` (GET com filtros e paginação, PATCH com sucesso e com erro 400 simulado), verificar: navegação entre Imóveis e Leads, lista e contagem, filtro por status e por tipo (e voltar a "Todos"), paginação, mudança de status com sucesso, recusa da API com mensagem em português, botão desabilitado durante a mutação, WhatsApp com telefone válido e ausência do atalho com telefone inutilizável, estados vazio e erro; restaurar `.env.local` e parar o proxy ao final
- [x] 4.2 Confirmar que um usuário não-staff continua vendo 404 em `/admin/leads` (o guard do layout cobre a subrota)
- [x] 4.3 `tsc` e `eslint` limpos no projeto todo; registrar no relatório o que só o usuário pode confirmar com uma conta staff real e o backend de verdade (regras de transição de status)
