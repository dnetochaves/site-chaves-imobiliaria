## Context

`/ajuda` não existe (404 hoje). Sem mockup no design. As outras páginas institucionais sem mockup (`/garantia`, `/sobre`, `/trabalhe-conosco`) seguem o mesmo layout: `max-w-4xl`, eyebrow em `text-brand-secondary` uppercase, `<h1>` + parágrafo, seção(ões) de conteúdo, bloco de CTA final em `bg-background-muted`. Ver proposal.md para a motivação e a lista de fatos reais usados.

## Goals / Non-Goals

**Goals:**
- FAQ com respostas 100% rastreáveis a comportamento já implementado (cada resposta cita, neste design, de onde vem o fato).
- Contato via WhatsApp como saída pra qualquer coisa fora da FAQ.

**Non-Goals:**
- Links pra `/condominios`, `/condominios/proposta` ou `/gestao` (rotas quebradas/deferidas, fora de escopo).
- Prazos, taxas, horário de atendimento — nada disso é afirmado.

## Decisions

### 1. Componente `Accordion` novo (shadcn/ui)
Não existe primitivo de accordion em `src/components/ui/` ainda. Adicionar via `npx shadcn@latest add accordion` (mesmo processo usado pra `dialog.tsx` no change `add-property-detail`), estilizado pelos tokens já configurados. Cada pergunta é um item colapsável — evita uma parede de texto numa página só de perguntas/respostas.

### 2. Conteúdo da FAQ (cada resposta rastreável a um fato real)
4 perguntas, uma por tema pedido na proposta:

1. **"Preciso criar conta para buscar um imóvel?"** → Não. A busca e a página de cada imóvel são públicas; conta só é necessária pra favoritar um imóvel ou enviar uma solicitação de contato ficar salva no seu perfil. *(Fato: `GET /imoveis` e `GET /imoveis/{id}` são públicos — aviso do back-end + `use-imoveis`/`use-imovel-detail` sem guard de auth.)*
2. **"Como funciona a visita a um imóvel?"** → Na página do imóvel você envia uma solicitação de contato; um corretor da Chaves entra em contato pra combinar o horário. Não existe agendamento automático de horário pelo site. *(Fato: requisito "Solicitação de contato para visita" em `property-detail/spec.md`, implementado em `ContactRequestDialog.tsx`.)*
3. **"Se eu alugar meu imóvel pela Chaves, tenho garantia de pagamento?"** → Sim. Você recebe o valor combinado todo mês, mesmo se o inquilino atrasar — a garantia é da Chaves, não depende de fiador, e a cobrança de inadimplência fica com a gente. *(Fato: conteúdo já publicado em `/garantia`, reaproveitado aqui, não reescrito com números novos.)*
4. **"Como anuncio meu imóvel?"** → Pelo formulário em `/anunciar`: você confirma o endereço num mapa antes de enviar e informa fotos já hospedadas (por URL). *(Fato: fluxo real de `ListPropertyForm.tsx`, change `add-list-property`.)*
5. **"Posso ser corretor parceiro da Chaves?"** → Sim, pra vender/alugar os imóveis da Chaves ou atuar na administração de condomínios. *(Fato: conteúdo já publicado em `/trabalhe-conosco`.)*

(5 perguntas, cobrindo os 4 temas pedidos na proposta — "buscar/visitar" virou 2 perguntas porque são fatos distintos: acesso sem login, e como funciona a visita.)

### 3. Bloco de contato via WhatsApp
Mesmo padrão de CTA final das outras páginas institucionais (`bg-background-muted`, título + texto curto + botão), usando `buildWhatsappHref` com uma mensagem inicial neutra (ex.: "Tenho uma dúvida sobre o site da Chaves"), igual ao padrão já usado em `PropertyPriceSidebar`/`comprar`/`trabalhe-conosco`.

## Risks / Trade-offs

- [A FAQ cobre só 5 perguntas — pode parecer curta] → Aceitável: cada resposta é rastreável a um fato real; melhor uma FAQ curta e honesta do que uma longa com respostas inventadas. Pode crescer depois, quando houver mais fatos reais pra responder (ex.: quando `/condominios` existir).
