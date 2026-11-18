## Context

O back-end (implementado, **não em produção**) remove de toda resposta pública `unidade.{rua, numero, complemento, cep, latitude, longitude, proprietario_id}` e `responsavel_id` dos resumos, e põe `endereco`, `codigo`, `responsavel_id` e `aprovado_por_id` (nulos para o público) só no detalhe, na lista administrativa e nas respostas de escrita. Em `GET /visitas/minhas`, `unidade` perde rua/número/complemento e o novo `endereco` só vem preenchido com a visita `agendada`. A lista da equipe (`GET /visitas`) mantém a forma, mas `unidade.rua/numero/complemento` podem ser nulos. O deploy deles depende da confirmação do front. Ver proposal.md - Why.

O OpenAPI de produção está **na etapa 1** do back-end (conferido ao implementar): o cadastro já aceita rua/número/CEP/coordenadas opcionais, `codigo` e `observacoes`, e `UnidadeRead.rua/numero/cep` já são anuláveis — mas a remoção do endereço das respostas públicas (etapa 2, esta entrega do back-end) ainda não foi ao ar, e `endereco` e `codigo` ainda não existem nas respostas. Os tipos foram regenerados no início da implementação; só `endereco`/`codigo` seguem como tipos locais.

## Goals / Non-Goals

- **Goal**: o front funciona com a API de hoje **e** com a nova, para o deploy poder acontecer nesta ordem: front → confirmação → back-end.
- **Goal**: nenhuma tela pública lê as chaves removidas (a confirmação ao back-end é exatamente isso).
- **Non-Goal**: leitura automática de texto colado do WhatsApp (outra entrega deles).
- **Non-Goal**: substituir o mapa público por um mapa aproximado (geocodificar só o bairro seria inventar uma posição; o back-end não oferece).

## Decisions

### Mapas públicos saem; o card sem foto usa o placeholder
Todos os mapas públicos dependem de coordenadas, que deixam de existir. Removem-se o painel de mapa e o destaque por hover da `/busca` (a lista ocupa a largura toda), a pré-visualização de mapa em `PropertyCard`/`PropertyListItem` (cai no `property-placeholder.svg` que já é o último recurso) e a seção "Onde fica" do detalhe. `MapView` continua só no cadastro (`/anunciar`), onde o dono confere o ponto da geocodificação opcional. Alternativa descartada: manter marcadores na vizinhança do bairro — exigiria inventar coordenadas.

### Tipos locais para `endereco` e `codigo`, trocados após o deploy
Um módulo `src/lib/api/endereco.ts` declara `Endereco` (rua, numero, complemento, cep, latitude, longitude, todos nuláveis) e um helper `lerEndereco(fonte)` que lê `fonte.endereco` quando existe e, só nas telas de equipe/responsável, cai para `unidade.rua/numero/...` legados (API antiga). Os campos opcionais `endereco` e `codigo` das respostas são acrescentados aos tipos via interseção local, sem editar `schema.ts` (gerado). O payload do cadastro usa o tipo gerado direto (já atualizado em produção). Depois do deploy do back-end: `npm run api:types` e remoção da interseção e do fallback legado (follow-up, listado nas tasks como nota).

### Telas públicas simplesmente deixam de ler as chaves
`mapImovel.ts` (latitude/longitude), `FavoritoItem` (rua/número como título/alt quando não há anúncio: passa a usar "Imóvel em {bairro}" e alt vazio/bairro), detalhe (`endereco` da migalha de pão e do `AgendarVisitaSection` — a migalha vira bairro/cidade), `SearchResultsMap` (removido). O tipo `PropertyDisplayData` perde `latitude/longitude`.

### Reserva: a confirmação não cita o endereço
O corpo de `POST /visitas/{id}/agendar` não traz endereço, e o público não o tem mais. A confirmação mostra data e hora e "O endereço completo fica disponível em Minhas visitas" com o link existente. `AgendarVisitaSection` perde a prop `endereco`.

### Minhas visitas
`VisitaItem` mostra bairro · cidade sempre e o bloco de endereço (`endereco.rua, numero - complemento`) só quando `endereco` não é nulo. Visita `agendada` com `endereco` nulo exibe "O endereço fica disponível após o agendamento"; demais status sem endereço escondem o bloco. Durante a transição, com a API antiga `endereco` não existe e `unidade.rua` ainda vem: o helper usa o legado só nesta tela e só para visita agendada, para o usuário não perder o endereço antes do deploy.

### Cadastro: tudo opcional exceto bairro/cidade/estado/área
Rua, número, CEP e coordenadas deixam de ser obrigatórios; "Buscar endereço" só é habilitado com rua e número e a confirmação passa a ser opcional (coordenadas só são enviadas se confirmadas). Campo vazio (`""`) é enviado como ausente. Seguro incêndio opcional (o texto de ajuda diz que conta como zero). Novos campos: `observacoes` (textarea, todos) e `codigo` (somente `user.is_staff`, normalização é do back-end). O 409 com `error.code === "codigo_ja_em_uso"` vira mensagem no campo do código. Assunção registrada: `codigo` é "código interno da Chaves", então só a equipe o vê no formulário — se o back-end quiser que o dono também preencha, é uma linha para liberar.

### Equipe: endereço completo de `endereco`
Detalhe do painel mostra `endereco` completo + `codigo`; `CriarHorarioSection` e `VisitaLinha` montam a linha de endereço com um helper que omite partes nulas (`formatEnderecoLinha`), em vez de interpolar `rua, numero` direto (que mostraria "null, null"). Lista administrativa ganha o `codigo` como selo quando existir.

### Textos
Placeholders "Bairro, rua ou praia" (Hero) e "Bairro, rua, condomínio..." (busca) passam a citar bairro, cidade ou condomínio; o comentário em `busca/filters.ts` deixa de listar rua.

## Risks / Trade-offs

- [O front não pode ser validado contra a API nova antes do deploy] → proxy de teste que devolve exatamente os formatos novos (e outro com o formato antigo); todos os cenários rodam nos dois.
- [Fallback legado esquecido depois do deploy] → tasks registram a limpeza como follow-up com `npm run api:types`; o helper concentra o fallback num único lugar.
- [Busca na `/busca` fica sem mapa, mudança visível de layout] → decisão de produto implícita no pedido do back-end ("site público mostra só bairro e cidade"); sinalizado no resumo ao usuário.

## Migration Plan

1. Implementar compatível com as duas formas de API. 2. Commit e push do front. 3. O usuário confirma ao back-end ("o front não lê mais as chaves removidas"). 4. Back-end faz o deploy. 5. Follow-up: `npm run api:types`, remover interseção de tipos e fallback legado.
