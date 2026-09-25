## Context

`/admin/visitas` hoje tem `CriarHorarioSection` (ID do imóvel → `useImovelDetail` → `datetime-local` → `new Date(valor).toISOString()`, ou seja, no fuso do navegador) e `AtualizarVisitaSection` (cancelar/concluir por ID, sem consulta prévia). O backend agora tem `GET /visitas` (staff): filtros `status`, `unidade_id`, `imovel_id` (imóvel inexistente = página vazia), `de`/`ate` (ISO 8601 com offset, inclusivos), `limit` (20, máx 100) e `offset`; cada item traz `unidade`, `imovel | null`, `visitante | null`, `visitante_telefone`, `visitante_observacoes` e a nota da equipe (`observacoes`). `concluir` só documenta 401/404/422/429/500; `cancelar` documenta 400/403/404 sem código específico. A ordem da lista não é documentada. `visita-labels.ts` já tem os formatadores de Salvador (change `add-visit-scheduling`). Ver proposal.md para motivação e escopo.

## Goals / Non-Goals

**Goals:**
- Equipe vê e age nas reservas sem precisar de IDs; horário digitado e exibido sempre em Salvador.

**Non-Goals:**
- Notificações, reagendar, calendário, editar/remover horários livres, visitas do responsável do imóvel.
- Reordenar a lista no cliente.

## Decisions

### 1. Layout da página
`/admin/visitas` passa a ter a lista em primeiro lugar (é o uso diário) e a criação de horário abaixo, como seção separada. `AtualizarVisitaSection` é removida (arquivo e uso), junto com o requisito da spec.

### 2. Horário de Salvador ↔ instante (helpers em `src/lib/visita-labels.ts`)
`salvadorLocalParaIso(valor)` interpreta `YYYY-MM-DDTHH:mm` como horário de `America/Bahia` e devolve um ISO com offset. Em vez de fixar `-03:00`, calcula o offset da zona para aquele momento com `Intl.DateTimeFormat("en-US", { timeZone: "America/Bahia", ... }).formatToParts`: parte do instante `Date.UTC(campos)` como palpite, mede a diferença que a zona produz para esse palpite e corrige uma vez (e confere o resultado). Assim continua correto se a regra da zona mudar, e é independente do fuso do navegador. Para os filtros: `inicioDoDiaSalvador(YYYY-MM-DD)` = `T00:00:00` e `fimDoDiaSalvador` = `T23:59:59`, ambos via o mesmo helper. Valores inválidos devolvem `null` (a tela trata). Alternativa rejeitada: `new Date(valor + "-03:00")` (simples, mas amarra o offset).

### 3. Hook e cache
`useVisitasStaff({status, imovel_id, de, ate, limit, offset})` com chave `["visitas-staff", params]`. `useAtualizarVisita` e `useCriarHorarioVisita` invalidam `["visitas-staff"]`, `["visitas-minhas"]` e `["visitas-disponiveis"]` no sucesso (o estado muda também para o visitante e para a página do imóvel).

### 4. Filtros e paginação
Estado local (padrão do painel de leads): `status` (inicial `agendada`; opção "Todas" usa a sentinela `todos`), `imovelId` (texto; aplicado ao acionar "Filtrar" ou Enter, validado como inteiro positivo antes de enviar, com mensagem de erro sem atualizar a lista), `de`/`ate` (`type="date"`). Qualquer mudança de filtro volta à página 1. Limite de 20 por página. Imóvel inexistente devolve lista vazia: mensagem de vazio, sem erro.

### 5. Item da lista
Componente `VisitaLinha`: data/hora (`formatDataHoraSalvador`), rótulo de status (`VISITA_STATUS_OPTIONS`), título do imóvel com link para `/admin/imoveis/{id}` quando `imovel` não é `null`, endereço da `unidade`, bloco do visitante (nome ou e-mail, e-mail, telefone, "Observações do visitante") quando `visitante` existe, e "Nota da equipe" quando `observacoes` existe. Os dois campos de texto livre têm rótulos distintos para não serem confundidos. A ordem é a recebida da API (suposição documentada: se o backend definir outra, é ajuste de ordenação no servidor).

### 6. Ações por linha com confirmação
Para `status === "agendada"`: "Concluir" e "Cancelar" (44px no mobile) abrem um `Dialog` de confirmação (mesmo padrão de `VisitaItem` em Minhas visitas), com "Manter" e "Confirmar", botões desabilitados durante o envio, erro por status HTTP em português dentro do diálogo e status mantido em caso de erro. `useAtualizarVisita` (que já recebe `{acao, visitaId}`) é reaproveitado. Em `src/lib/visita-errors.ts`, `describeCancelarError` continua como está e ganha um irmão `describeConcluirError` (400 "Essa visita não pode ser concluída no estado atual.", 403, 404, 401 e genérico), sem usar o `message` em inglês.

### 7. Criar horário
Mantém o fluxo (ID do imóvel → conferência → data/hora → observações). O `datetime-local` é rotulado "Data e hora (horário de Salvador)", o valor vai por `salvadorLocalParaIso`, a confirmação usa `formatDataHoraSalvador`, e o sucesso invalida a lista (ver decisão 3). `formatVisitaDataHora` (fuso do navegador) deixa de ter uso e é removida.

## Risks / Trade-offs

- [Ordem da lista não documentada] → exibida como vem; se ficar ruim na prática, pedir ordenação ao backend.
- [Não há como testar `GET /visitas` real sem conta staff] → proxy de teste com o formato do contrato; o usuário confirma com dados reais.
- [Regras de transição de `concluir` desconhecidas] → a API recusa e a tela explica por status; sem regra no cliente.
- [Teste de fuso no navegador de teste (já em Salvador) não distingue] → o helper é verificado por script com `TZ` em UTC, Tóquio, Nova York e São Paulo, e o log do proxy confirma o instante enviado.
