## Why

O painel de visitas foi feito quando a API não tinha listagem: a equipe só conseguia criar horários e agir numa visita se soubesse o ID. O backend agora entrega `GET /visitas` (com quem reservou, telefone e observações), então o painel pode mostrar as reservas de verdade. Além disso, o horário digitado ao criar uma visita hoje vale no fuso do navegador de quem digita, enquanto o visitante vê tudo no horário de Salvador. Esta é a segunda de duas changes (a primeira, `add-visit-scheduling`, cuidou do lado do visitante).

## What Changes

- **Lista de visitas no painel** (`/admin/visitas`): mostra as visitas com data e hora (horário de Salvador), status, imóvel (com link para a moderação quando o anúncio existe), endereço, quem reservou (nome, e-mail, telefone e observações do visitante) e a nota interna da equipe.
- **Filtros:** status (abre em "Agendadas"; também Todas, Disponíveis, Concluídas e Canceladas), ID do imóvel e período (de/até, em horário de Salvador). Paginação de 20 por página, contagem total e estados de carregamento, erro e vazio. Imóvel inexistente resulta em lista vazia, sem erro.
- **Ações por linha:** "Concluir" e "Cancelar" nas visitas agendadas, cada uma com confirmação; erros em português e status mantido quando a API recusa.
- **Removida** a seção "Cancelar ou concluir visita por ID": as ações agora vêm da lista.
- **Criar horário:** a data e hora digitadas passam a valer sempre como horário de Salvador (com aviso na tela), independentemente do fuso do navegador; a confirmação também é exibida em Salvador e o novo horário aparece na lista.
- Suposição registrada: a API não documenta a ordem da lista; o painel mostra na ordem recebida.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `admin-panel`: novo requisito de listagem de visitas com filtros; novo requisito de ações por linha, que substitui o de cancelar/concluir por ID (removido); o requisito de criar horário passa a usar o horário de Salvador.
- `mobile-access`: as ações de cancelar e concluir da lista de visitas do painel entram na exigência de área de toque de 44px.

## Impact

- `src/app/admin/visitas/` (nova lista e diálogo de ação; remoção da seção por ID; ajuste na criação), novo hook `useVisitasStaff`, ajustes em `use-atualizar-visita`/`use-criar-horario-visita` (invalidação de cache), `src/lib/visita-labels.ts` (helper de horário de Salvador) e `src/lib/visita-errors.ts` (erro de concluir).
- Sem mudanças no backend nem no site público.
- Fora de escopo: notificações, reagendar, calendário visual, editar ou remover horários livres, visitas do responsável do imóvel, listagem de imóveis por status, exportação.
