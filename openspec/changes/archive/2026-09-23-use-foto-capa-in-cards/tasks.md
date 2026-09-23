## 1. Dado

- [x] 1.1 Em `mapImovel.ts`, adicionar `imageUrl: string | undefined` a `PropertyDisplayData` e retornar `imovel.foto_capa ?? undefined` em `toPropertyDisplayData`

## 2. Componentes

- [x] 2.1 Adicionar `unoptimized` ao `<Image>` de `imageUrl` em `PropertyCard.tsx`
- [x] 2.2 Adicionar `unoptimized` ao `<Image>` de `imageUrl` em `PropertyListItem.tsx`
- [x] 2.3 Em `FavoritoItem.tsx`, trocar `src="/property-placeholder.svg"` fixo por `src={display?.imageUrl ?? "/property-placeholder.svg"}` + `unoptimized`

## 3. Verificação

- [x] 3.1 No browser (via proxy CORS local, já que a API não libera `localhost:3000`), conferir com dados reais: Home, `/alugar`, `/comprar` e `/busca` mostram a foto real de `foto_capa` em todos os imóveis publicados (7 de 7, nenhum mapa restante); `/favoritos` testado via debug harness temporário (removido) com e sem foto, confirmando foto real e fallback pro placeholder
- [x] 3.2 Imóvel real #7 ("33") usa uma foto hospedada no Cloudinary (fora de `picsum.photos`) e carregou sem erro de otimização, confirmando o `unoptimized`; `tsc`/`eslint` limpos
