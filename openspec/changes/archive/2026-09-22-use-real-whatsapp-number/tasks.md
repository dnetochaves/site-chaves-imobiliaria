## 1. Trocar o número

- [x] 1.1 Em `src/lib/whatsapp.ts`, renomear `WHATSAPP_PLACEHOLDER_NUMBER` para `CHAVES_WHATSAPP_NUMBER`, trocar o valor para `"5571983917864"` e remover o comentário de TODO; ajustar a referência interna em `buildWhatsappHref`
- [x] 1.2 `grep -rn WHATSAPP_PLACEHOLDER_NUMBER src` não retorna nenhum resultado; `tsc`/`eslint` limpos

## 2. Verificação

- [x] 2.1 No browser, conferir 3 dos 4 pontos de contato (`/comprar`, Home e `/trabalhe-conosco`) e confirmar que o link gerado (`href`) aponta para `https://wa.me/5571983917864?...`; o 4º (detalhe do imóvel) usa a mesma `buildWhatsappHref` sem número próprio, coberto pela mesma fonte única
