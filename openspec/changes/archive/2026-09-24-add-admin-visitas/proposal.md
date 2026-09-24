## Why

A API permite à equipe criar horários de visita para os imóveis e cancelar ou concluir visitas, mas o painel administrativo ainda não tem interface para isso — hoje só dá pra fazer chamando a API direto.

## What Changes

- Nova tela `/admin/visitas` no painel restrito a staff, com duas seções:
  - **Criar horário de visita**: a equipe informa o ID do imóvel; o painel mostra o imóvel encontrado (título e endereço) para conferência; a equipe escolhe data e hora (e, opcionalmente, observações) e cria o horário. A confirmação mostra o horário criado, com o ID da visita e o status.
  - **Cancelar ou concluir uma visita**: a equipe informa o ID da visita e escolhe cancelar ou concluir; a tela mostra o resultado devolvido pela API. Se a API recusar, mostra um erro em português.
- O painel ganha um terceiro link de navegação: "Visitas".
- Limitações conhecidas da API: não existe listagem nem consulta de visitas, então o painel não lista horários ou agendamentos e não mostra uma visita antes de agir nela — o ID da visita vem da confirmação de criação do horário.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `admin-panel`: a navegação do painel passa a incluir a seção de visitas, e o painel ganha a criação de horários de visita e o cancelamento/conclusão de visitas por ID.

## Impact

- Nova rota `src/app/admin/visitas/page.tsx`; `src/app/admin/layout.tsx` (terceiro link e lógica da seção ativa).
- Novos hooks de API (criar horário, cancelar, concluir) e módulo compartilhado com rótulos de status de visita.
- O guard continua sendo só experiência de uso; a proteção real é o 403 da API.
- Fora de escopo: listagem/histórico de visitas, calendário, editar ou remover horários, agendar visita, mudanças no site público, mudanças de backend.
