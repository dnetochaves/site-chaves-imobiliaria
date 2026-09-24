## Context

O painel `/admin` (change `add-admin-panel`) já tem o guard por `is_staff` em `src/app/admin/layout.tsx`, a lista de imóveis, e o padrão de ação com `useMutation` (`use-moderar-imovel.ts`) e erros em português via `describeApiError`. A API expõe `GET /leads` (staff, filtros `status`/`tipo`, `limit`/`offset`, resposta `{items,total,limit,offset}`) e `PATCH /leads/{id}/status` (staff, body `{status}`, devolve o lead). A máquina de estados de status é validada no backend e não está descrita no schema. Ver proposal.md para motivação e escopo.

## Goals / Non-Goals

**Goals:**
- Equipe consegue ver, filtrar e mudar o status dos leads, e iniciar uma conversa de WhatsApp com o lead, sem chamar a API à mão.

**Non-Goals:**
- Regras de transição no front, edição/criação/exclusão de leads, notas, responsável, exportação, busca por texto.
- Link para o imóvel a partir de `unidade_id`: esse número é o id da unidade física, e o site não tem rota por unidade; a tela só o exibe como referência.

## Decisions

### 1. Rota e navegação mínima
Nova rota `/admin/leads` sob o layout já guardado. O layout ganha dois links ("Imóveis" → `/admin`, "Leads" → `/admin/leads`) com destaque do ativo (via `usePathname`). É o mínimo para a tela ser alcançável; nada além disso. Suposição registrada: navegação não foi pedida como item próprio.

### 2. Rótulos em português num módulo compartilhado
`src/lib/lead-labels.ts` exporta `LEAD_STATUS_OPTIONS` e `LEAD_TIPO_OPTIONS` (`{value,label}[]`, mesmo padrão de `src/lib/property-types.ts`), tipados a partir de `components["schemas"]["LeadStatus"|"LeadTipo"]`. Rótulos a partir dos próprios nomes: novo → "Novo", em_atendimento → "Em atendimento", concluido → "Concluído", perdido → "Perdido"; simulacao_financiamento → "Simulação de financiamento", contato_imovel → "Contato sobre imóvel", proposta_condominio → "Proposta de condomínio", anunciar_imovel → "Anunciar imóvel", outro → "Outro". Sem inventar significado além dos nomes.

### 3. Listagem: filtros e paginação em estado local
`useLeads({status, tipo, limit, offset})` (query hook, padrão de `use-imoveis.ts`, chave `["leads", params]`). Filtros e página ficam em estado local da página (`Select` de status e de tipo, com opção "Todos"); mudar filtro volta para a página 1. Paginação simples com botões de página, `limit` = 10 (mesmo padrão de `SearchPagination` da busca). Não vai para a URL: é uma tela interna de trabalho, sem necessidade de link compartilhável. Alternativa considerada (filtros na URL como em `/busca`) — rejeitada por ser custo sem benefício aqui.

### 4. Mudança de status sem regra no front
Cada linha tem um `Select` com os 4 status (valor atual selecionado). Ao escolher outro, dispara `useAtualizarStatusLead()` (`PATCH`, `useMutation` + `toApiError`); no sucesso invalida `["leads"]` (a lista reflete o novo status); no erro mostra, na própria linha, mensagem pt-BR via `describeApiError` com fallback "Não foi possível alterar o status. A transição pode não ser permitida a partir do status atual." e mantém o status anterior (o `Select` é controlado pelo dado da lista, então volta sozinho). Enquanto a mutação daquele lead roda, o `Select` fica desabilitado. Um hook por linha (componente `LeadRow` chama o hook) para o estado de pending/erro ser por lead.

### 5. Link de WhatsApp do lead
`buildLeadWhatsappHref(telefone)` em `src/lib/whatsapp.ts` (o `buildWhatsappHref` existente serve para falar COM a Chaves, número fixo). O telefone é texto livre (o formulário público só exige `type="tel"`). Regra: se o telefone começa com "+", o DDI já está explícito — usar os dígitos como estão (10 a 15 dígitos; fora disso, sem link); caso contrário, extrair apenas os dígitos; com 10 ou 11 dígitos (DDD + número, formato brasileiro sem DDI) prefixar `55`; com 12 ou 13 dígitos começando em `55` usar como está; qualquer outro caso retorna `null` e o botão não é exibido (o telefone continua visível). Suposição registrada: como o site e o WhatsApp da Chaves são brasileiros, números de 10–11 dígitos são tratados como nacionais; números internacionais fora desse formato ficam sem atalho em vez de arriscar abrir a conversa errada. O link abre `https://wa.me/<número>` com `target="_blank" rel="noopener noreferrer"` (padrão de `/ajuda`).

### 6. Segurança
O guard é só UX; o 403 da API é a proteção real. Erros 403/401 nas ações caem no fallback de erro em português.

## Risks / Trade-offs

- [Regras de transição desconhecidas no front → usuário pode tentar mudanças inválidas] → a API recusa e a tela explica em português; status exibido não muda.
- [Telefone em formato livre → heurística de dígitos pode errar em casos raros] → só gera link em formatos claramente brasileiros; nos demais o botão some e o telefone segue visível.
- [Filtros fora da URL → recarregar a página perde o filtro] → aceitável para tela interna.
