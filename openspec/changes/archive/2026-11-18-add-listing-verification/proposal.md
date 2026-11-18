## Why

A seção "Selecionados para hoje" da home só lista imóveis **verificados** (`verificado = true`), que é a curadoria da equipe. Mas o campo `verificado` nunca é alterado por nenhuma rota: um imóvel novo, mesmo aprovado, nasce `false` e fica fora da home. Em produção hoje há 1 imóvel publicado e 0 verificados, então a home mostra "Nenhum imóvel disponível no momento". A equipe precisa de um botão no painel para verificar (e remover a verificação de) um imóvel.

## What Changes

- Na lista de imóveis do painel, um botão **Verificar** / **Remover verificação** por imóvel, exibido só quando a API manda a ação em `acoes_permitidas` (o front não decide a regra), enviado direto, sem confirmação, e sem alterar o status de publicação.
- Selo **"Verificado"** na linha dos imóveis verificados.
- Filtro **Verificação** (todos / verificados / não verificados) na lista, para a equipe ver o que está elegível para a home.
- Os erros dessas ações seguem o padrão das outras (imóvel mudou de situação → atualiza a lista; nada em inglês).
- A home em si não muda: continua pedindo `verificado=true`.

## Dependências do back-end (bloqueantes)

Esta change **só pode ser implementada depois** que o back-end publicar:
1. **`POST /imoveis/{id}/verificar`** e **`POST /imoveis/{id}/desverificar`** (staff-only, sem corpo, devolvendo `ImovelDetail`), e os valores `verificar` e `desverificar` em `ListingAction`/`acoes_permitidas` (pedido já enviado ao back-end).
2. **Parâmetro `verificado` (bool) em `GET /admin/imoveis`** para o filtro. Este item **não estava no primeiro pedido** e precisa ser acrescentado; sem ele o filtro não pode existir (filtrar só a página carregada daria contagens erradas) e o requisito de filtro por verificação deve ser retirado antes de implementar.

## Capabilities

### Modified Capabilities
- `admin-panel`: a lista de imóveis passa a exibir o selo de verificado e o filtro de verificação, e a gestão de publicação passa a incluir verificar e remover a verificação.
- `mobile-access`: os novos botões entram na regra de 44px.

## Impact

- `src/app/admin/_components/ImovelAdminLinha.tsx` (botões e selo), `ImoveisAdminLista.tsx` (filtro), `src/lib/imovel-labels.ts` (rótulos e ordem das ações), `src/lib/api/hooks/use-moderar-imovel.ts` (duas ações novas), `src/lib/imovel-errors.ts`.
- Tipos da API regenerados quando as rotas existirem (`npm run api:types`).
- Nenhuma mudança na home nem em telas públicas.
