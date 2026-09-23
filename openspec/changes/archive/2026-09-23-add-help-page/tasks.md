## 1. Componente de base

- [x] 1.1 Adicionar o primitivo `Accordion` via `npx shadcn@latest add accordion`; verificar que renderiza com os tokens do Design System (mesma estilização das outras páginas institucionais). O gerador usou `import { cn } from "cn"` (pacote novo) em vez do padrão do projeto — corrigido para `@/lib/utils` e a dependência `cn` removida do `package.json`

## 2. Página /ajuda

- [x] 2.1 Criar `src/app/ajuda/page.tsx`: eyebrow + `<h1>` + intro curta, seguindo o layout de `/garantia`/`/sobre` (`max-w-4xl`)
- [x] 2.2 Adicionar a FAQ em `Accordion` com as 5 perguntas/respostas definidas em design.md
- [x] 2.3 Adicionar o bloco final de contato via WhatsApp (`buildWhatsappHref`), mesmo padrão visual do CTA final das outras páginas institucionais

## 3. Verificação

- [x] 3.1 No browser, acessar `/ajuda` a partir do link do Header e do Footer (confirmar que não dá mais 404), abrir/fechar cada item da FAQ, e clicar no contato de WhatsApp confirmando que o `href` gerado aponta para o número real
- [x] 3.2 Conferir que nenhum link da página aponta para `/condominios`, `/condominios/proposta` ou `/gestao`; `tsc`/`eslint` limpos
