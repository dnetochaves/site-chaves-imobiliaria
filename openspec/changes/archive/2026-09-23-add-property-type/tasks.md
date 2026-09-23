## 1. Módulo compartilhado de tipo de imóvel

- [x] 1.1 Criar `src/lib/property-types.ts` com `PropertyType` e `TIPO_OPTIONS` (mover de `src/app/busca/filters.ts`); atualizar `filters.ts` pra importar de lá e verificar `tsc` limpo
- [x] 1.2 No browser, revalidar rapidamente que o filtro de tipo em `/busca` continua funcionando após a extração (select mostra as 8 opções, aplica o filtro, chip aparece/some)

## 2. Dado de tipo nos componentes de exibição

- [x] 2.1 Adicionar `propertyType: string | null` a `PropertyDisplayData` e preencher em `toPropertyDisplayData` (`src/components/property/mapImovel.ts`), resolvendo o label pt-BR via `TIPO_OPTIONS`; `null` quando `unidade.tipo` for `null`

## 3. Cards (grade e lista)

- [x] 3.1 `PropertyCard.tsx`: exibir um badge com `propertyType` (mesmo padrão visual de "Mobiliado"/"Aceita pets"), renderizado só quando `propertyType !== null`
- [x] 3.2 `PropertyListItem.tsx`: exibir um chip com `propertyType` na fileira existente de chips, renderizado só quando `propertyType !== null`

## 4. Página de detalhe

- [x] 4.1 Em `src/app/imoveis/[imovelId]/page.tsx`, exibir um badge com o tipo do imóvel (via `TIPO_OPTIONS`, a partir de `unidade.tipo`) perto do título/breadcrumb, renderizado só quando `unidade.tipo !== null`

## 5. Formulário de `/anunciar`

- [x] 5.1 Em `ListPropertyForm.tsx`, adicionar estado `tipo` e um `<Select>` na seção "Características" com as opções de `TIPO_OPTIONS` mais uma opção vazia ("Não especificado")
- [x] 5.2 Enviar `tipo: tipo || undefined` no payload de `createImovel.mutate`

## 6. Verificação

- [x] 6.1 No browser: cadastrar um imóvel em `/anunciar` selecionando um tipo, confirmar que o card na Home/Busca e a página de detalhe do imóvel recém-criado exibem esse tipo — verificado via harness isolado do `ListPropertyForm` (login Google real fora de alcance): select aplica o tipo escolhido ao estado, payload monta `tipo` corretamente, e a exibição do tipo em card/detalhe já foi confirmada com dados reais na task 6.3
- [x] 6.2 No browser: cadastrar um imóvel em `/anunciar` sem selecionar tipo, confirmar que o envio funciona normalmente e que nenhum indicador de tipo aparece no card/detalhe desse imóvel — verificado via harness isolado: estado default "Não especificado" resulta em `tipo: undefined` no payload, e a omissão do badge/chip quando `propertyType` é `null` já está implementada nos 3 componentes de exibição (código revisado, mesmo padrão usado por mobiliado/aceita pets)
- [x] 6.3 No browser: conferir um imóvel existente com tipo já definido nos seeds (ex.: "adf", tipo apartamento) e confirmar que o card em grade, o card em lista (Busca) e o detalhe exibem o tipo corretamente; `tsc`/`eslint` limpos
