## Context

Ver [proposal.md](proposal.md) para o porquê. Não há mockup no design system pra essa página — diferente de `/alugar`, `/comprar` e `/sobre` (`add-institutional-pages`), que seguiram um mockup real. O padrão visual de 3 colunas de diferenciais + CTA final já existe (`/sobre`) e é reaproveitado aqui pra manter consistência, mas o conteúdo textual é novo.

## Goals / Non-Goals

**Goals:**
- Página `/garantia` navegável, com conteúdo real (não um placeholder vazio).
- Remover o link "Bairros" do Footer, que não corresponde a nenhuma página existente ou planejada.

**Non-Goals:**
- As outras páginas do Footer sem mockup (Ajuda, Gestão, Trabalhe conosco) — changes futuros.
- Qualquer simulador ou calculadora de garantia — só a página institucional/explicativa.

## Decisions

**1. Conteúdo da página escrito do zero, seguindo a voz já estabelecida no resto do site (ex.: a frase "garantimos o pagamento todo mês" já usada em `src/app/_home/ListPropertyCta.tsx`), em vez de inventar um mockup que não existe.**
Título: "Garantia de aluguel todo mês, mesmo se o inquilino atrasar." Subtítulo explicando que a Chaves assume o risco de inadimplência. 3 diferenciais: "Pagamento garantido", "Sem fiador, sem burocracia", "Cobrança é com a gente". CTA final "Anunciar imóvel" → `/anunciar`.

**2. Reaproveita a mesma estrutura visual de `/sobre` (label + título + subtítulo + grid de 3 colunas + CTA final em card destacado) — sem criar um componente de layout compartilhado entre as duas páginas.**
Mesmo raciocínio já registrado no `add-institutional-pages`: páginas pequenas e parecidas o suficiente pra não justificar uma abstração agora.

**3. Remoção do link "Bairros" do Footer é só uma edição do array `columns` em `Footer.tsx` — sem necessidade de spec delta (a spec `site-shell` não enumera links específicos, só fala em "colunas temáticas").**

## Risks / Trade-offs

- **[Trade-off] Conteúdo institucional sem validação de marketing/jurídico real** → Aceito conscientemente, mesmo padrão já usado no resto do site (Home, Sobre); revisar com o usuário antes de qualquer deploy de produção, junto com o CRECI/CNPJ de exemplo já sinalizados no código.
