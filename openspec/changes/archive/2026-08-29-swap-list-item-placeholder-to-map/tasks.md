## 1. PropertyListItem: preview de mapa no lugar do placeholder

- [x] 1.1 Desestruturar `latitude`/`longitude` de `PropertyListItemProps` em `PropertyListItem.tsx`; quando ambos forem números válidos, renderizar `MapView` com `interactive={false}`, `zoom={15}`, `center=[longitude, latitude]`, um marcador sem label, `className="absolute inset-0 h-full w-full"`, no lugar da `<Image>`
- [x] 1.2 Quando `latitude`/`longitude` forem `null`, manter o `<Image src="/property-placeholder.svg" />` atual
- [x] 1.3 Conferir que `SearchResultsList.tsx` já passa `latitude`/`longitude` via `{...item}` (spread de `toPropertyDisplayData`) sem precisar de mudança adicional

## 2. Verificação visual

- [x] 2.1 Rodar o app localmente, abrir `/busca` e verificar: itens com imóvel geocodificado mostram o mini-mapa no thumbnail; o item continua navegando para `/imoveis/{id}` ao clicar em qualquer ponto (inclusive sobre o mapa e sobre o controle de atribuição do MapLibre); hover no item ainda destaca o marcador correspondente no mapa de resultados (`SearchResultsMap`, comportamento existente, não deve quebrar)
- [x] 2.2 Testar o caso de borda (imóvel sem coordenadas, via debug harness se não houver nos dados reais) e confirmar que o placeholder genérico continua aparecendo, sem quebrar o layout
