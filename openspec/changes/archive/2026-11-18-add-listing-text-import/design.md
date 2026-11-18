## Context

O back-end entregou `POST /admin/imoveis/interpretar-texto` (staff-only, em produção; confirmado no `openapi.json`): recebe `{texto}` (até 6000 caracteres), devolve `{imovel (rascunho, tudo opcional/nulo), campos_ausentes, campos_invalidos, avisos[{codigo, mensagem}], amenidades_nao_mapeadas, condominio, condominios_candidatos, nome_condominio_no_texto}` e **não grava nada**. Quem grava é o `POST /imoveis`, que o formulário de `/anunciar` (`ListPropertyForm`) já chama. Ver proposal.md - Why. Limites do servidor: 10 req/min (429 com `Retry-After`), timeout da IA de 45 s, e dois 503 distintos (`interpretacao_indisponivel`, `interpretacao_nao_configurada`).

## Goals / Non-Goals

- **Goal**: reaproveitar o formulário de cadastro existente como tela de revisão, em vez de criar um segundo formulário que divergiria dele.
- **Goal**: o front nunca salva sozinho e nunca esconde um aviso — um `codigo` de aviso desconhecido é exibido normalmente (o conjunto é aberto).
- **Non-Goal**: mostrar os nomes das amenidades reconhecidas (não existe `GET /amenidades`; só `amenidade_ids`), preencher fotos (`foto_urls` nunca vem), vincular condomínio (a API não vincula e o vínculo é por outras rotas), abrir o recurso a proprietários.

## Decisions

### Rota própria na área de staff, sem nova aba
`/admin/imoveis/importar` herda o layout e a guarda do painel (não-staff recebe 404 como em todo `/admin`) e já fica sob a aba "Imóveis" (prefixo `/admin/imoveis`). O atalho "Cadastrar por texto" fica no cabeçalho de `ImoveisAdminLista`. O segmento estático `importar` convive com `[imovelId]`, que só casa números.

### Máquina de estados simples na própria página
`entrada → interpretando → revisao → sucesso`, em estado local: sem rota por etapa, porque a proposta não é persistida (recarregar a página volta à entrada, o que é o comportamento certo para um rascunho que não está salvo em lugar nenhum). A resposta da interpretação fica em memória e o formulário de revisão recebe uma `key` nova a cada interpretação, para remontar com os valores novos.

### `ListPropertyForm` recebe valores iniciais, destaques e destino
Três props opcionais, sem mudar o uso de `/anunciar`:
- `valoresIniciais` (o rascunho): número vira texto, `null` vira vazio, booleano nulo vira `false`, `tipo` nulo vira "não especificado"; `amenidade_ids` é guardado em estado e reenviado (o formulário não tem seletor de amenidades).
- `destaques: { ausentes: string[]; invalidos: string[] }`: um mapa nome-do-campo-da-API → id do input marca esses inputs com `aria-invalid` e rótulo em destaque; o par `disponivel_aluguel`/`disponivel_venda` destaca o grupo de operação.
- `hrefSucesso(id)` e `aposSucesso` opcionais: na importação, a confirmação leva a `/admin/imoveis/{id}` ("em análise" não aparece no site público) e oferece "Cadastrar outro por texto".
Chaves nulas já não são enviadas (o formulário só envia o que tem valor), o que cumpre o requisito de "remover `null` antes do `POST /imoveis`".

### Hook sem retry, com timeout de 60 s
`useInterpretarTexto` é uma mutação (sem retry por padrão) sobre `POST /admin/imoveis/interpretar-texto`, com `AbortSignal.timeout(60_000)`; o estouro vira um erro local equivalente a `interpretacao_indisponivel` ("não foi possível interpretar agora"). O texto vai exatamente como colado (sem `trim` no envio; o `trim` só decide se o botão está habilitado).

### Erros por `error.code`, nunca pelo texto em inglês
`src/lib/interpretacao-errors.ts` mapeia: 422 `texto_sem_dados_de_imovel`, 422 `validation_error` (mensagem no campo), 503 `interpretacao_indisponivel`, 503 `interpretacao_nao_configurada` (desabilita o botão até recarregar e explica), 429 (via `describeApiError`, com `Retry-After`), 401/403 (login / 404 do painel). Toda mensagem de erro vem acompanhada de um link "Cadastrar manualmente" para `/anunciar`.

### Avisos: severidade por `codigo`, conjunto aberto
Um mapa `codigo → severidade` ("alta" para `total_divergente`, `possivel_duplicado`, `codigo_ja_cadastrado`, `endereco_na_descricao`, `valor_sem_lastro`; "normal" para o resto, inclusive códigos desconhecidos). A `mensagem` já vem em português e é exibida sempre; o `codigo` só decide o destaque.

### Privacidade na tela
O aviso de LGPD (texto vai a uma IA de terceiros; mascaramento parcial; não colar nomes de proprietários) fica visível na tela de entrada, como pediu o back-end.

## Risks / Trade-offs

- [A IA pode não estar configurada em produção (o back-end não confirmou)] → o 503 `interpretacao_nao_configurada` desabilita o recurso com explicação e oferece o cadastro manual; não é tratado como falha geral.
- [Não dá para testar a IA de verdade sem a chave] → os testes usam um proxy que devolve os formatos documentados (inclusive o exemplo do back-end, avisos desconhecidos e todos os erros); a primeira interpretação real fica para o usuário confirmar.
- [Alterar `ListPropertyForm` pode regredir `/anunciar`] → as props são opcionais e `/anunciar` é reverificado no fim (cadastro simples, geocodificação, código só para staff).
- [Número de caracteres: o limite de 6000 não é exposto pela API] → fixo no front, como o próprio back-end orienta.

## Migration Plan

Nenhuma migração; a rota e o recurso são aditivos. Deploy direto. Antes de liberar para a equipe, confirmar com o back-end que a chave da IA está configurada em produção.
