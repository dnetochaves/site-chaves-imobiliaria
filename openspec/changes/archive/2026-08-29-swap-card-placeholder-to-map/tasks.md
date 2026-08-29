## 1. MapView: modo não-interativo

- [x] 1.1 Adicionar prop `interactive?: boolean` (default `true`) a `MapView.tsx`, repassando `interactive: false` ao construtor do `maplibregl.Map` quando `false`; verificar que os usos existentes (`/imoveis/[imovelId]`, `/busca`, `/anunciar`) continuam interativos sem passar a prop

## 2. PropertyCard: preview de mapa no lugar do placeholder

- [x] 2.1 Na área de imagem de `PropertyCard.tsx`, quando `latitude`/`longitude` forem não-nulos, renderizar `MapView` com `interactive={false}`, `zoom={15}`, `center=[longitude, latitude]`, um marcador sem label, e `className` cobrindo a mesma área que a `<Image>` ocupava (`absolute inset-0` dentro do container `aspect-[4/3]`)
- [x] 2.2 Quando `latitude`/`longitude` forem `null`, manter o `<Image src="/property-placeholder.svg" />` atual
- [x] 2.3 Adicionar `latitude`/`longitude` como props de `PropertyCardProps` (já existem em `PropertyDisplayData`, só faltam ser aceitas pelo card) e conferir que os 3 callers (`SelecionadosParaHoje.tsx`, `/alugar/page.tsx`, `/comprar/page.tsx`) já passam esses valores via spread de `toPropertyDisplayData`, sem mudança adicional neles

## 3. Verificação visual

- [x] 3.1 Rodar o app localmente e verificar na Home, `/alugar` e `/comprar`: cards com imóvel geocodificado mostram o mini-mapa centralizado na localização correta; o card continua navegando para `/imoveis/{id}` ao clicar em qualquer ponto (inclusive sobre o mapa); scroll da página não é capturado pelo mapa
- [x] 3.2 Testar o caso de borda (imóvel sem coordenadas, se houver algum nos dados de teste, ou simular via debug harness) e confirmar que o placeholder genérico continua aparecendo nesse caso, sem quebrar o layout
