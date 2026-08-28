## Why

Os links "Anunciar" já existem no Header, na Home ("Tem um imóvel para alugar?") e no Footer, todos apontando pra `/anunciar` — hoje 404. A API já tem `POST /imoveis` com tudo que precisa pra criar um anúncio de verdade.

## What Changes

- Nova rota `/anunciar`: formulário que cria um imóvel de verdade via `POST /imoveis`, com autenticação obrigatória.
- Geocodificação real do endereço digitado (Nominatim/OpenStreetMap, gratuito, sem chave), com confirmação visual num mapa antes de permitir o envio.
- Campo de URLs de fotos já hospedadas (não há upload de arquivo na API).
- Amenidades ficam de fora do formulário nesta v1 (não há endpoint pra listar as reais).
- Confirmação de sucesso com link pro imóvel recém-criado; erro no envio preserva os dados já preenchidos.

## Capabilities

### New Capabilities
- `list-property`: formulário de cadastro de imóvel — endereço geocodificado, specs, dados comerciais, fotos por URL, envio e confirmação.

## Impact

- Novo `src/app/anunciar/page.tsx` e componentes de suporte.
- Reaproveita `MapView` (mapa de confirmação do endereço geocodificado) e `AuthContext` (exigência de login) já existentes.
- Novo hook de geocodificação (Nominatim) e um novo hook de mutação pra `POST /imoveis`.
- Nenhuma mudança em `Header.tsx`/Home/Footer — os links pra `/anunciar` já existem, só passam a resolver de verdade.
