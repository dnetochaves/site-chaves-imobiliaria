## 1. Base compatível com as duas formas de API

- [x] 1.1 `src/lib/api/endereco.ts`: tipo `Endereco`, interseções locais para `endereco`/`codigo`/`observacoes`, `lerEndereco(fonte)` (com fallback legado) e `formatEnderecoLinha` que omite partes nulas; verificar com `tsc` e um script de casos (todas as partes, só rua, nulo)
- [x] 1.2 Proxy de teste (scratchpad) com dois modos, `API=antiga` e `API=nova`, simulando `/imoveis`, `/imoveis/{id}`, `/favoritos`, `/visitas/minhas`, `/visitas`, `/admin/imoveis`, `/visitas/disponiveis-em-breve` e `POST /imoveis` (inclusive `409 codigo_ja_em_uso`) nos formatos descritos pelo back-end

## 2. Telas públicas sem endereço exato nem mapa

- [x] 2.1 `mapImovel.ts`, `PropertyCard` e `PropertyListItem`: remover latitude/longitude e a pré-visualização de mapa (cai no placeholder)
- [x] 2.2 `/busca`: remover o painel de mapa (`SearchResultsMap`) e o destaque por hover; a lista ocupa a largura toda; atualizar o comentário de `filters.ts` e os placeholders da busca e do Hero (sem "rua")
- [x] 2.3 Detalhe `/imoveis/{id}`: remover "Onde fica" e a rua/número da migalha e do endereço (só bairro e cidade); `AgendarVisitaSection` sem a prop de endereço, confirmação com "O endereço completo fica disponível em Minhas visitas"
- [x] 2.4 `FavoritoItem`: parar de usar rua/número (título "Imóvel em {bairro}" quando não há anúncio, `alt` sem rua)
- [x] 2.5 Verificar no navegador nos dois modos do proxy: busca (sem mapa), cards com e sem foto, detalhe, favoritos, home, reserva de visita; conferir no console de rede que nenhuma tela pública lê as chaves removidas (varredura `grep` no código por `unidade.(rua|numero|complemento|cep|latitude|longitude)` fora das telas de equipe)

## 3. Minhas visitas

- [x] 3.1 `VisitaItem`: bairro · cidade sempre; endereço completo só com `endereco` não nulo (fallback legado só para visita agendada na API antiga); visita agendada sem endereço mostra "disponível após o agendamento"; cancelada/concluída sem bloco de endereço
- [x] 3.2 Verificar no navegador (modo novo e antigo): agendada com endereço, agendada sem endereço, cancelada, concluída, anúncio inexistente

## 4. Telas da equipe

- [x] 4.1 Detalhe `/admin/imoveis/{id}`: endereço completo (omitindo partes nulas) e código interno; `CriarHorarioSection` e `VisitaLinha` com `formatEnderecoLinha`; selo do `codigo` na lista administrativa
- [x] 4.2 Verificar no navegador: imóvel com endereço e código, imóvel sem endereço, visita da equipe com `unidade.rua` nulo

## 5. Cadastro

- [x] 5.1 `ListPropertyForm`: rua, número e CEP opcionais (vazio enviado como ausente), "Buscar endereço" habilitado com rua e número, geocodificação confirmada opcional (coordenadas só quando confirmadas), envio sem bloqueio por geocodificação
- [x] 5.2 Seguro incêndio opcional; campo `observacoes` para todos; campo `codigo` só para `is_staff`; tratar `409 codigo_ja_em_uso` na mensagem do campo
- [x] 5.3 Verificar no navegador: cadastro só com bairro/cidade/estado/área, com geocodificação confirmada, aluguel sem seguro, código duplicado (staff), usuário comum sem o campo de código

## 6. Fechamento

- [x] 6.1 Testar em 375px e 320px (`/busca` sem painel de mapa, detalhe, Minhas visitas, `/anunciar`) sem rolagem horizontal; conferir o desktop
- [x] 6.2 Restaurar `.env.local`, parar proxy e servidor; `tsc --noEmit` e `eslint` sem erros
- [x] 6.3 `openspec validate hide-public-address --strict` sem erros

> Follow-up (depois do deploy do back-end, fora desta change): `npm run api:types`, remover as interseções de tipo e o fallback legado de `endereco.ts`.
