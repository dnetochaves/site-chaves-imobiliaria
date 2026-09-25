## Why

Hoje o site só permite "pedir contato" na página do imóvel: a equipe liga depois para combinar a visita. A API de visitas agora está completa (horários livres por imóvel, reserva, "minhas visitas" e cancelamento), então o visitante pode escolher um horário e reservar direto pelo site. Esta é a primeira de duas changes: esta cobre o lado do visitante; a atualização do painel da equipe (`update-admin-visitas`) vem depois.

## What Changes

- **Página do imóvel:** nova seção "Agendar visita" com os horários livres agrupados por dia, no horário de Salvador. Ao escolher um horário, o visitante informa o telefone (obrigatório) e, se quiser, observações, e confirma. A tela trata cada erro da reserva com uma mensagem em português (horário já reservado, horário no passado, imóvel indisponível, conflito com outra visita, visita já agendada neste imóvel) e recarrega a lista quando o horário deixou de valer. O "Pedir contato" e o WhatsApp continuam, como alternativa.
- **Login com retorno:** para reservar é preciso estar logado. Ao iniciar o login, o site guarda a página de origem e, depois do login, volta para ela (hoje sempre vai para a Home). O destino é validado para aceitar só caminhos internos. Isso também melhora `/anunciar` e `/admin`.
- **Nova página `/minhas-visitas`:** o visitante vê suas visitas ("Próximas" e "Todas"), com data e hora, status, endereço e link para o imóvel (quando o anúncio ainda existe), e pode cancelar uma visita agendada com confirmação.
- **Header e menu:** novo link "Minhas visitas" para usuários autenticados (desktop e menu mobile).
- **Tipos da API:** regeneração dos tipos a partir de produção (entram os schemas novos de visita).
- Limitações conhecidas do backend, sem tratamento no site: não há aviso automático (e-mail ou WhatsApp) quando alguém reserva; a equipe só vê a reserva no painel. O horário guarda só o início (sem duração).

## Capabilities

### New Capabilities

- `my-visits`: página em que o visitante autenticado vê e cancela suas visitas.

### Modified Capabilities

- `property-detail`: o pedido de contato deixa de ser a única forma de pedir uma visita; ganha horários disponíveis e reserva.
- `authentication`: o login passa a lembrar a página de origem e o callback volta para ela.
- `site-shell`: novo link "Minhas visitas" no header/menu para usuários autenticados.
- `mobile-access`: a nova página e a nova seção entram na lista de páginas verificadas em telas estreitas, e os novos botões ganham a exigência de área de toque.

## Impact

- `src/app/imoveis/[imovelId]/` (nova seção e botão de acesso), nova rota `src/app/minhas-visitas/`, `src/lib/auth/AuthContext.tsx` e `src/app/auth/callback/AuthCallbackContent.tsx` (retorno pós-login), `src/components/shell/Header.tsx`, `src/lib/api/generated/schema.ts` (regenerado), novos hooks e helpers em `src/lib/`.
- O painel atual de visitas (`add-admin-visitas`) continua funcionando: já envia `data_hora` com offset, como o backend passou a exigir.
- Sem mudanças no backend.
- Fora de escopo: painel da equipe (lista de visitas com filtros e ações, fuso no painel), notificações, reagendar, calendário visual, duração do horário, lista de visitas para o responsável do imóvel, listagem de imóveis por status.
