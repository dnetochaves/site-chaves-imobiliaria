## Why

A imobiliária decidiu que o site público mostra **só bairro e cidade** de cada imóvel. O back-end já implementou isso (ainda **não está em produção**): rua, número, CEP, coordenadas e ids internos de usuário saem de todas as respostas públicas; o endereço completo continua visível só para a equipe, para o responsável pelo anúncio e para o visitante enquanto a visita dele está agendada. O back-end só faz o deploy depois que o front confirmar que não lê mais as chaves removidas — então o front precisa ser adaptado primeiro, e de forma que funcione tanto com a API de hoje quanto com a nova.

## What Changes

- **BREAKING (contrato):** nenhuma tela pública lê mais `unidade.rua`, `numero`, `complemento`, `cep`, `latitude`, `longitude` nem `responsavel_id`. Busca, cards, detalhe do imóvel, favoritos e home mostram apenas bairro e cidade.
- Os mapas públicos deixam de existir (precisam de coordenadas): o painel de mapa da busca, a pré-visualização de mapa nos cards sem foto (passa a ser o placeholder genérico) e o mapa "Onde fica" do detalhe.
- "Minhas visitas" passa a ler o endereço do campo `endereco`, que só vem preenchido enquanto a visita está agendada; visita cancelada ou concluída esconde o bloco de endereço. A confirmação de reserva na página do imóvel deixa de citar o endereço e aponta para "Minhas visitas".
- Telas da equipe (detalhe do imóvel no painel, criar horário, lista de visitas) leem o endereço completo de `endereco` e exibem o `codigo` interno; qualquer parte do endereço pode ser nula.
- A busca por texto deixa de casar com a rua (e os textos de ajuda param de citar rua).
- Cadastro (`/anunciar`): rua, número, CEP e coordenadas passam a ser opcionais (bairro, cidade e estado são o mínimo); a geocodificação vira opcional; seguro incêndio passa a ser opcional; entram os campos opcionais `observacoes` (para todos) e `codigo` (só para equipe), com tratamento do erro `codigo_ja_em_uso`.

## Capabilities

### Modified Capabilities
- `property-detail`: o detalhe mostra só bairro e cidade, sem mapa; a confirmação de reserva remete a Minhas visitas.
- `property-listing`: o card e o card de lista usam foto ou placeholder (sem pré-visualização de mapa).
- `search-page`: a busca por texto não cobre mais a rua; o mapa de resultados é removido.
- `my-visits`: o endereço só aparece enquanto a visita está agendada.
- `list-property`: endereço detalhado e geocodificação opcionais; seguro incêndio opcional; observações e código interno; erro de código duplicado.
- `admin-panel`: o detalhe do imóvel exibe o endereço completo e o código interno, tolerando partes nulas.

## Impact

- Telas: `/busca` (sem painel de mapa), cards, `/imoveis/{id}`, `/favoritos`, home (placeholder da busca), `/minhas-visitas`, `/anunciar`, `/admin/imoveis/{id}`, `/admin/visitas`.
- `src/components/map/MapView` deixa de ser usado nas telas públicas (continua no cadastro, para o dono conferir o ponto quando optar por geocodificar).
- Novos tipos locais para `endereco`/`codigo` (o OpenAPI de produção ainda é o antigo); trocados pelos gerados depois do deploy do back-end.
- Ordem de entrega: front primeiro (compatível com a API atual e a nova) → o usuário confirma ao back-end → deploy do back-end → `npm run api:types`.
