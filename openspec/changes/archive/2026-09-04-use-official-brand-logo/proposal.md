## Why

O site usa desde o início um placeholder de logo (um "C" desenhado à mão em SVG inline + só a palavra "chaves") porque não havia identidade visual oficial ainda. O usuário acabou de adicionar o pacote completo de logo da marca (`public/logo-svg/` e `public/logo-png/`, gerados em 29/08/2026) e pediu pra usar a logo principal no Header/Navbar do site.

## What Changes

- `Logo.tsx` (componente compartilhado por Header e Footer) passa a renderizar a logo oficial (`logo-principal`, variante `positiva`) no lugar do placeholder desenhado à mão.
- `src/app/favicon.ico` passa a ser o favicon oficial da marca no lugar do placeholder padrão do `create-next-app`.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `site-shell`: novo requisito sobre o favicon refletir a marca oficial (nunca foi especificado antes). Os requisitos existentes de Header/Footer ("exibir a logo da marca") continuam válidos como estão — passam a ser satisfeitos pela logo oficial em vez do placeholder, sem mudança de comportamento especificado.

## Impact

- `src/components/shell/Logo.tsx`: implementação interna do componente (mesma assinatura, mesmo uso em `Header.tsx`/`Footer.tsx` — nenhum dos dois precisa mudar).
- `src/app/favicon.ico`: arquivo substituído.
- Sem mudança de API, dados ou qualquer outra página/funcionalidade.
