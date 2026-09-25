## 1. Tipos e base compartilhada

- [x] 1.1 Rodar `npm run api:types` e conferir que entram `VisitaDisponivelRead`, `MinhaVisitaRead`, `VisitaBookingCreate` e os campos novos de `VisitaRead`; `tsc` continua limpo (telas do painel de visitas incluídas)
- [x] 1.2 Criar os helpers de data no fuso `America/Bahia` (dia, hora, data+hora e chave de agrupamento por dia) e verificar com um script que `2026-10-01T14:00:00-03:00` resulta em 14:00 de 01/10 mesmo com `TZ` diferente e que o agrupamento por dia não usa UTC
- [x] 1.3 Criar `src/lib/visita-errors.ts` (`describeAgendarError` por `error.code`/status e `describeCancelarError` por status HTTP, sem usar `message`, com a ação sugerida) e verificar cada código do contrato por script; `tsc`/`eslint` limpos

## 2. Login com retorno à página de origem

- [x] 2.1 Criar `src/lib/auth/return-to.ts` (`isSafeReturnPath`, `saveReturnTo`, `consumeReturnTo`, com `sessionStorage` em `try/catch`) e verificar por script os casos: caminho interno válido, `//evil.com`, `/\evil`, `https://evil.com`, `/auth/callback`, vazio e valor com quebra de linha
- [x] 2.2 Em `AuthContext.login()`, chamar `saveReturnTo()` antes do redirecionamento (sem sobrescrever um destino já guardado quando a página atual não é segura); no `AuthCallbackContent`, redirecionar para `consumeReturnTo()` (Home quando não há destino válido)

## 3. Hooks de API

- [x] 3.1 Criar `useVisitasDisponiveis(imovelId)` e `useAgendarVisita()` em `src/lib/api/hooks/` (`toApiError`; a mutation invalida `["visitas-disponiveis", imovelId]` e `["visitas-minhas"]`)
- [x] 3.2 Criar `useMinhasVisitas({status, limit, offset})` e `useCancelarVisita()`; verificar `tsc` limpo

## 4. Seção "Agendar visita" na página do imóvel

- [x] 4.1 Criar a seção com âncora `#agendar-visita` na coluna principal: aviso "Horários de Salvador", horários agrupados por dia (botões de 44px no mobile), estados carregando / erro / vazio (com o pedido de contato disponível)
- [x] 4.2 Escolher horário: sem login mostra "Entrar para agendar" (`login()`); com login mostra o formulário (telefone obrigatório de até 30 caracteres, observações opcionais) e "Confirmar" desabilitado durante o envio
- [x] 4.3 Sucesso com confirmação (data/hora em Salvador, endereço, link Minhas visitas); erros por código com a ação sugerida (recarregar e desfazer a escolha em `visita_indisponivel`/`visita_no_passado`, link Minhas visitas em `visita_ja_agendada_no_imovel`, entrar de novo em 401, campo de telefone em 422); nunca exibir o `observacoes` da resposta
- [x] 4.4 Na barra lateral, botão principal "Agendar visita" (rola até a seção) e "Pedir contato" como secundário, mantendo o WhatsApp; conferir que o pedido de contato continua funcionando

## 5. Minhas visitas

- [x] 5.1 Criar `src/app/minhas-visitas/page.tsx` com o guard (carregando / login com retorno), abas "Próximas" e "Todas" (troca volta à página 1), lista paginada (20 por página) e estados carregando / erro / vazio
- [x] 5.2 Cada visita com data/hora em Salvador, status em português, endereço e título com link só quando `imovel` não é `null`; "Cancelar visita" só para `agendada`, com `Dialog` de confirmação, erros por status HTTP mantendo o status, confirmação desabilitada durante o envio; abas e botão com 44px no mobile
- [x] 5.3 Adicionar "Minhas visitas" ao `accountLinks` do `Header` (só autenticado; desktop e menu mobile)

## 6. Verificação

- [x] 6.1 Recriar um proxy local de teste em Node (`/auth/me` com `user-token`; horários disponíveis com horários, vazio e 404; `agendar` com sucesso, `visita_indisponivel`, `visita_no_passado`, `visita_ja_agendada_no_imovel`, `imovel_nao_publicado`, 401 e 422; `minhas` com um item de `imovel: null`; `cancelar` com 200, 400 e 403; resto repassado à produção só para leitura), apontar `.env.local` para ele e subir o servidor; conferir também, somente leitura, `GET /imoveis/{id}/visitas/disponiveis` real em produção
- [x] 6.2 Página do imóvel: lista agrupada por dia no horário de Salvador (incluindo com o fuso do navegador forçado para outro fuso), vazio com pedido de contato, telefone obrigatório, reserva com sucesso e atualização da lista, cada erro com sua mensagem e ação, botão desabilitado em andamento, e não logado vendo "Entrar para agendar"
- [x] 6.3 Login com retorno: verificar que `login()` grava a página de origem, e que o callback volta ao destino válido e ignora destinos inválidos ou externos (simulando o callback, pois a tela do Google não é automatizável); confirmar que `/anunciar` e `/admin` também voltam à origem
- [x] 6.4 Minhas visitas: acesso sem login, abas, paginação, imóvel nulo sem link, cancelar com confirmação, desistir, erros 400/403, estados vazio e erro, e o link no header desktop e no menu mobile só para autenticado
- [x] 6.5 Mobile 375px e 320px: `/imoveis/{id}` com a seção aberta (lista e formulário) e `/minhas-visitas` sem rolagem horizontal, com pelo menos 44px nos botões de horário, abas e cancelar; e o header nas larguras 768px e 1024px com o novo link; desktop sem regressão
- [x] 6.6 `tsc` e `eslint` limpos no projeto todo; restaurar `.env.local`, parar proxy e servidor e voltar o viewport para desktop; registrar no relatório o que só o usuário confirma com login Google real e backend real (reserva de ponta a ponta, retorno pós-login real, e que não há aviso automático à equipe)
