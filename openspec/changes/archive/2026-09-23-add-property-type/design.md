## Context

`PropertyType` e as labels pt-BR das 8 opções já existem, mas moram em `src/app/busca/filters.ts` (`TIPO_OPTIONS`), criados no change `add-search-filters` só pro filtro de busca. `PropertyDisplayData` (`src/components/property/mapImovel.ts`) é o tipo compartilhado que alimenta `PropertyCard.tsx` e `PropertyListItem.tsx`; não inclui `tipo` hoje. Ver proposal.md para a motivação e a decisão já tomada com o usuário (omitir o indicador quando `tipo` vier `null`, em vez de mostrar um texto tipo "Não informado").

## Goals / Non-Goals

**Goals:**
- O tipo do imóvel fica disponível e visível nos 3 pontos onde imóveis são exibidos (card em grade, card em lista, detalhe), com o mesmo texto/rótulo em todos.
- O formulário de `/anunciar` permite informar o tipo, reaproveitando as mesmas 8 opções.

**Non-Goals:**
- Filtro de busca por tipo — já implementado.
- Editar o tipo de um imóvel já cadastrado.
- Ícones específicos por tipo (só o texto/label, mesmo padrão dos badges existentes).

## Decisions

### 1. Mover `TIPO_OPTIONS`/`PropertyType` pra um módulo compartilhado
Cria `src/lib/property-types.ts` com `export type PropertyType = components["schemas"]["PropertyType"]` e `export const TIPO_OPTIONS: {value, label}[]`, movendo o conteúdo hoje em `src/app/busca/filters.ts`. `filters.ts` passa a importar de lá (`import { TIPO_OPTIONS, type PropertyType } from "@/lib/property-types"`), sem mudar nenhum comportamento da tela de Busca. Alternativa considerada: duplicar o array em cada lugar que precisa — rejeitada, pois desalinha as 8 labels em pt-BR ao longo do tempo.

### 2. `PropertyDisplayData` ganha `propertyType: string | null`
Em vez de expor o `PropertyType` bruto, `toPropertyDisplayData` já resolve pro label pt-BR (reaproveitando `TIPO_OPTIONS`) e retorna `propertyType: string | null` — mesmo padrão de `priceLabel`/`areaLabel`, que já chegam formatados pros componentes de exibição. Quando `unidade.tipo` é `null`, `propertyType` também é `null`.

### 3. Indicador de tipo nos cards: badge/chip, mesmo padrão dos indicadores existentes
- `PropertyCard.tsx` (grade): um badge adicional, mesmo estilo visual do badge "Mobiliado"/"Aceita pets" (rendered condicionalmente, ao lado deles), evitando redesenhar o card.
- `PropertyListItem.tsx` (lista): mais um chip na fileira existente (metragem, quartos, vagas, mobiliado, aceita pets), mesmo estilo.
- Em ambos, o badge/chip só é renderizado quando `propertyType !== null` (decisão já tomada com o usuário no proposal).

### 4. Detalhe: tipo ao lado do breadcrumb/título
Na página de detalhe (`src/app/imoveis/[imovelId]/page.tsx`), o tipo entra como um badge pequeno perto do título (mesma linha do bairro/cidade que já aparece acima do `<h1>`), sem alterar o restante do layout. Só renderiza quando `unidade.tipo !== null`.

### 5. Formulário: select de tipo, reaproveitando `TIPO_OPTIONS`
`ListPropertyForm.tsx` ganha um `<Select>` (mesmo componente já usado em `SearchFilters.tsx`) na seção "Características", com as 8 opções de `TIPO_OPTIONS` mais uma opção vazia ("Não especificado", já que o campo é opcional na API). Estado local `tipo: string` (vazio = não enviar); `handleSubmit` envia `tipo: tipo || undefined` no payload de `useCreateImovel` — o hook em si não muda, só o valor passado.

## Risks / Trade-offs

- [Mover `TIPO_OPTIONS` de `filters.ts` pra um módulo novo é uma mudança em código já testado/arquivado] → Mitigado: é só extrair o array pra outro arquivo e trocar o import; nenhuma lógica muda, comportamento da Busca coberto pelos testes manuais já feitos no `add-search-filters` (revalidar rapidamente no browser depois da extração).
