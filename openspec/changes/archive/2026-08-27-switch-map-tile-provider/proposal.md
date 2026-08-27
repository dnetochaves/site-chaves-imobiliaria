## Why

O OpenFreeMap (provedor de tiles do mapa, decidido no `add-search-page`) está servindo tiles vetoriais vazios (0 bytes) em qualquer lugar do mundo — confirmado nesta sessão testando diretamente o endpoint deles, inclusive fora de São Paulo. O mapa continua inicializando (marcador e atribuição aparecem), mas nenhuma rua/prédio é desenhado. É um problema real de infraestrutura do lado deles, fora do nosso controle, com a resposta vazia cacheada por ~10 anos (`cache-control: max-age=315360000`) — não dá pra saber quando (ou se) isso vai se resolver sozinho.

## What Changes

- Troca o provedor de tiles do `MapView` de OpenFreeMap pro CARTO (estilo "Voyager"), confirmado funcionando nesta sessão (tile real de São Paulo testado, 573KB de dado vetorial retornado corretamente).
- Mantém a mesma restrição original (gratuito, sem chave de API) — CARTO oferece isso pros estilos básicos deles.
- Nenhuma mudança de comportamento observável além de o mapa voltar a mostrar ruas/prédios de verdade — é puramente uma troca de implementação (o `MapView` já é o único lugar que sabe qual provedor usa).

## Capabilities

Nenhuma capability nova ou modificada — o comportamento esperado do mapa (mostrar a localização real com tiles visíveis) já era o pretendido desde o `add-search-page`; isso só corrige a implementação quebrada por um provedor de terceiro, sem alterar nenhum requisito de spec.

## Impact

- `src/components/map/MapView.tsx`: a constante `DEFAULT_MAP_STYLE`, e uma chamada a `setWorkerUrl()`.
- **Achado durante a implementação, além do escopo original**: a troca de provedor sozinha não resolvia o problema — o `maplibre-gl` v6 tinha um bug real de resolução da URL do seu Worker de parsing de tiles sob o Turpoback (`new Worker("", ...)`), quebrando silenciosamente o carregamento de tiles vetoriais em qualquer provedor. Corrigido com a API oficial `setWorkerUrl()` do MapLibre, apontando pro worker servido de `public/` via um novo script `postinstall` (`scripts/copy-maplibre-worker.mjs`). Ver tasks.md pro detalhe completo.
- Novos arquivos: `scripts/copy-maplibre-worker.mjs`, `public/maplibre-gl-worker.mjs`, `public/maplibre-gl-shared.mjs` (os dois últimos gerados/copiados, ignorados pelo ESLint).
- `package.json`: novo script `postinstall`.
- `eslint.config.mjs`: ignora os dois arquivos vendorizados em `public/`.
- Nenhuma mudança em `SearchResultsMap.tsx` nem na página de detalhe do imóvel — ambos consomem `MapView` sem conhecer o provedor por trás.
