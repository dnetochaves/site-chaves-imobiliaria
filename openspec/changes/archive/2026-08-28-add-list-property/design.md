## Context

Ver [proposal.md](proposal.md) para o porquê. `POST /imoveis` (`ImovelSubmissionCreate` → `ImovelDetail`, 201) exige autenticação — confirmado nesta sessão (sem token, 401). Três gaps reais da API já foram investigados e decididos com o usuário (ver proposal.md): sem endpoint de amenidades (omitidas do formulário), sem upload de foto (campo de URLs), sem geocodificação no backend (feita no frontend via Nominatim, testado funcionando via CORS direto do browser). `AuthContext`, `MapView` e o padrão de hooks TanStack Query (`use-imoveis.ts` etc.) já existem e são reaproveitados.

## Goals / Non-Goals

**Goals:**
- Cadastro de imóvel funcional de ponta a ponta, com endereço geocodificado de verdade.
- Nunca permitir enviar coordenadas não confirmadas pelo usuário.

**Non-Goals:**
- Upload de foto e seleção de amenidades reais — bloqueados por endpoints que não existem (ver proposal.md).
- Edição/exclusão de anúncio, fluxo de aprovação/moderação, painel de "meus imóveis" — fora de escopo, changes futuros.

## Decisions

**1. Geocodificação via Nominatim (`https://nominatim.openstreetmap.org/search`), acionada por um botão explícito ("Buscar endereço"), nunca a cada tecla digitada.**
Nominatim tem uma política de uso que desencoraja automação/alto volume de requisições; buscar só quando o usuário pede evita abusar do serviço gratuito. Resultado sempre exibido pro usuário confirmar (endereço resolvido + `MapView` com o pin) antes de liberar o envio — geocodificação é heurística e pode devolver um lugar errado (confirmado nesta sessão testando um endereço real).

**2. Estado do formulário: endereço geocodificado (lat/lng + endereço resolvido) fica separado dos campos de endereço digitados, e é invalidado (exige buscar de novo) se o usuário editar rua/número/bairro/cidade depois de já ter confirmado uma geocodificação.**
Evita o caso de enviar coordenadas de um endereço diferente do que ficou escrito no formulário.

**3. Novo hook `useGeocodeAddress()` (`src/lib/api/hooks/use-geocode-address.ts`) chama o Nominatim diretamente (não é a API da Chaves) — mutação simples, sem cache de query.**
Novo hook `useCreateImovel()` (`src/lib/api/hooks/use-create-imovel.ts`) chama `POST /imoveis`, seguindo o mesmo padrão dos outros hooks de mutação do projeto (`use-create-lead.ts`).

**4. Formulário em `src/app/anunciar/page.tsx`, `status !== "authenticated"` dispara `login()`/estado de carregamento — mesmo padrão já usado em `/favoritos`.**

**5. `foto_urls`: um campo de texto simples onde o usuário cola uma URL por linha (ou separadas por vírgula), convertido pra `string[]` só na hora de montar o payload — sem preview de imagem nem validação de que a URL é realmente uma foto (não temos como verificar isso sem baixar o conteúdo).**

**6. Erro no envio: o estado do formulário (todos os campos + geocodificação confirmada) fica em `useState` no componente da página, não é resetado no `catch` da mutação — só a mensagem de erro é exibida.**

## Risks / Trade-offs

- **[Risco] Nominatim pode ficar indisponível ou lento (serviço gratuito de terceiro, sem SLA)** → Mitigação: estado de erro claro na geocodificação (Requirement: Geocodificação sem resultado cobre timeout/erro também), sem travar o resto do formulário.
- **[Trade-off] Campo de fotos por URL é uma UX inferior a upload real** → Aceito conscientemente (ver proposal.md); documentado como pendência pro backend expor um endpoint de upload no futuro.
- **[Trade-off] Sem amenidades nesta v1** → Aceito; usuário usa a descrição livre enquanto não existe endpoint de listagem.
