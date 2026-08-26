## Why

O mockup real da Home (`design_system/sistema-montado.pdf`, Ciclo 03) mostra um header e um footer presentes em toda página do site — hoje o projeto não tem nenhum dos dois; `src/app/layout.tsx` renderiza só `{children}` sem nenhum shell ao redor. Analisando o PDF em alta resolução (zoom em cada seção do mockup), a Home implementada no change anterior (`add-home-page`) ficou sem esse contexto de navegação, o que a torna visualmente muito diferente do design real. Este change resolve a parte do gap que é compartilhada por toda página (header/footer); a revisão do conteúdo específico da Home fica para um change seguinte.

## What Changes

- Adicionar um componente de **Header** (`src/components/shell/Header.tsx`): logo "chaves", navegação (Alugar, Comprar, Anunciar, Ajuda), e ações à direita (Entrar, Criar conta).
- Adicionar um componente de **Footer** (`src/components/shell/Footer.tsx`): logo, identificação (CRECI, CNPJ) e 3 colunas de links (Buscar, Proprietários, Chaves).
- Envolver `{children}` em `src/app/layout.tsx` com Header + Footer, aplicando-os a toda página do site (atuais e futuras).
- Todos os links de navegação apontam para rotas que ainda não existem no projeto (ex.: `/alugar`, `/comprar`, `/entrar`, `/criar-conta`, `/anunciar`, `/garantia`, `/gestao`, `/sobre`, `/trabalhe-conosco`, `/ajuda`, `/bairros`) — 404 é o comportamento esperado até cada rota ser implementada em changes futuros, seguindo a mesma decisão já tomada para `/busca` no change `add-home-page`.

**Fora de escopo**: autenticação real por trás de "Entrar"/"Criar conta"; menu mobile/hambúrguer (o mockup só mostra a versão desktop do header — o comportamento em mobile é uma decisão a tomar em design.md, não a implementar aqui além de não quebrar o layout); qualquer mudança na capability `home-page` (fica para o próximo change).

## Capabilities

### New Capabilities
- `site-shell`: header e footer aplicados globalmente, presentes em toda página do site.

### Modified Capabilities
(nenhuma — `home-page` não é alterada por este change)

## Impact

- **Código**: `src/app/layout.tsx` (envolve `{children}`), novos `src/components/shell/Header.tsx` e `src/components/shell/Footer.tsx`.
- **Dependências**: nenhuma nova — reusa Button do shadcn/ui e os tokens de tema já existentes.
- **Navegação**: introduz ~11 novos links apontando para rotas ainda não implementadas (404 esperado, documentado).
