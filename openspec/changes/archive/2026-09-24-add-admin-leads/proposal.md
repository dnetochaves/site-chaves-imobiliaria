## Why

Pedidos de contato, simulações e outros leads chegam pela API, mas a equipe não tem onde vê-los nem acompanhar o atendimento — hoje só dá pra consultar chamando a API direto. O painel administrativo (`/admin`) já existe, restrito a staff; falta a gestão de leads.

## What Changes

- Nova tela `/admin/leads`, dentro do painel restrito a staff:
  - Lista paginada de leads (nome, telefone, tipo, status, contexto e o número da unidade relacionada, quando houver).
  - Filtros por status (novo, em atendimento, concluído, perdido) e por tipo.
  - Mudança de status de um lead; se a API recusar a transição, a tela mostra um erro em português e mantém o status.
  - Atalho por lead para abrir uma conversa de WhatsApp com o telefone informado.
- O painel ganha navegação mínima entre suas duas seções ("Imóveis" e "Leads"). Não foi pedida como item próprio, mas sem ela a tela de leads seria inalcançável; fica restrita a dois links.
- Limitação conhecida: as regras de transição de status vivem no backend e não estão descritas na API; o front oferece todos os status e deixa a API recusar os inválidos.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `admin-panel`: passa a cobrir a gestão de leads (listagem com filtros, mudança de status, atalho de WhatsApp) e a navegação entre as seções do painel.

## Impact

- Nova rota `src/app/admin/leads/page.tsx`; `src/app/admin/layout.tsx` (links de navegação).
- Novos hooks de API para listar leads e mudar status; módulo compartilhado com rótulos em português de status e tipo de lead; função para montar o link de WhatsApp de um telefone.
- O guard continua sendo só experiência de uso; a proteção real é o 403 da API.
- Fora de escopo: criar/editar/excluir leads, notas de atendimento, atribuir responsável, exportar, busca por texto, mudanças de backend, link para o imóvel a partir do número da unidade.
