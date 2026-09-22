## Context

`src/lib/whatsapp.ts` exporta `WHATSAPP_PLACEHOLDER_NUMBER` (usado só internamente ao arquivo) e `buildWhatsappHref(message)`, consumida pelos 4 pontos de contato do site. `wa.me` espera o número em dígitos, com código do país, sem `+`/espaços/traços.

## Goals / Non-Goals

**Goals:**
- Todo botão de WhatsApp do site abre conversa com o número real da Chaves.

**Non-Goals:**
- Mudar as mensagens pré-preenchidas de cada contexto.
- Adicionar outros canais de contato (telefone, e-mail).

## Decisions

### 1. Renomear a constante, não só trocar o valor
`WHATSAPP_PLACEHOLDER_NUMBER` → `CHAVES_WHATSAPP_NUMBER = "5571983917864"` (formato `wa.me`: `55` + DDD `71` + `983917864`, sem `+`). Renomear evita o nome "placeholder" sobrevivendo no código depois que o valor deixou de ser um placeholder; remove também o comentário de TODO, que não se aplica mais.

## Risks / Trade-offs

- [Erro de digitação no número quebraria silenciosamente o contato real] → Mitigado testando o link gerado no navegador antes de arquivar (abre o WhatsApp Web/app com o número certo).
