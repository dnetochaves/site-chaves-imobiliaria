## Why

Hoje um corretor não tem como se apresentar rapidamente a um cliente: não existe nenhuma página pública com seus dados. O back-end já expõe um endpoint público (`GET /corretores/publico/{slug}`, sem autenticação, em produção desde 28/09/2026) pensado exatamente para isso — falta a página no front que funcione como cartão de visita digital, compartilhável por WhatsApp, e-mail ou link direto.

## What Changes

- Nova página pública `/corretores/[slug]` (sem login): foto, nome, CRECI, cidade, bio e redes sociais do corretor, quando existirem — nada inventado quando o dado não existe. Ações de contato (WhatsApp com mensagem pré-preenchida, ligar, e-mail, Instagram/LinkedIn) e uma ação de compartilhar a página.
- Slug inexistente ou corretor desativado: a página mostra "corretor não encontrado", sem distinguir os dois casos (a API já responde os dois com o mesmo 404).
- A página pública de um imóvel (`/imoveis/{id}`) passa a linkar para o cartão do corretor responsável, quando houver um atribuído (a API já retorna `corretor.slug` nesse endpoint).
- O formulário de criar/editar corretor no painel (`/admin/corretores`) ganha os campos novos do cadastro: bio, cidade, redes sociais (Instagram/LinkedIn) e edição do slug (não digitado na criação — a API gera sozinha; editável depois). A lista de corretores ganha um link "Ver card público" por linha.

## Capabilities

### New Capabilities
- `corretor-publico`: página pública de apresentação de um corretor, acessível por slug, sem autenticação.

### Modified Capabilities
- `admin-panel`: o requisito de cadastrar/editar corretor passa a cobrir também bio, cidade, redes sociais e o slug; a lista de corretores ganha o link para o card público.
- `property-detail`: a página de um imóvel passa a linkar para o corretor responsável, quando houver.
- `mobile-access`: a nova página pública entra na lista de páginas sem rolagem horizontal em telas estreitas, e suas ações de contato entram na regra de 44px de área de toque.

## Impact

- Nova rota pública `/corretores/[slug]`.
- Novo hook de leitura sobre `GET /corretores/publico/{slug}` (sem token).
- `src/lib/whatsapp.ts`: nova função (ou variante) que aceita telefone + mensagem pré-preenchida, para o botão de WhatsApp do card.
- `src/app/imoveis/[imovelId]/_components/PropertyPriceSidebar.tsx` (ou equivalente): link para o corretor responsável quando `imovel.corretor` existir.
- `src/app/admin/corretores/_components/CorretorFormulario.tsx` e `CorretorLinha.tsx`: campos novos e link para o card público.
- Nenhuma mudança de contrato com a API: os endpoints e campos já estão em produção; tipos já regenerados (`npm run api:types`).
