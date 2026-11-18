## Why

A equipe recebe os anúncios como mensagens de WhatsApp coladas e hoje precisa digitar tudo no formulário de cadastro. O back-end entregou (em produção) o `POST /admin/imoveis/interpretar-texto`: recebe a mensagem colada e devolve uma **proposta de cadastro** para revisão humana — com o que faltou, o que veio inválido e avisos de conferência —, sem gravar nada. Falta a tela que coloca isso no fluxo: colar, interpretar, revisar no formulário de cadastro e só então salvar.

## What Changes

- Nova tela da equipe `/admin/imoveis/importar` ("Cadastrar por texto"), com um atalho na lista de imóveis do painel. Só staff acessa (mesma guarda do painel).
- **Entrada:** `textarea` com contador `n/6000`, botão "Interpretar" (desabilitado com texto vazio, acima do limite ou chamada em andamento), aviso de privacidade (o texto sai para um serviço de IA de terceiros; telefone, e-mail, CPF e CNPJ são mascarados, nomes de pessoas não — evitar colar nomes de proprietários).
- **Interpretação:** indicador de progresso e timeout de 60 s (o servidor limita em 45 s), sem retry automático.
- **Revisão:** o formulário de cadastro existente (`/anunciar`) aparece pré-preenchido com a proposta; painel de avisos (com severidade por `codigo`, códigos desconhecidos exibidos normalmente), campos ausentes e inválidos destacados, quantidade de amenidades reconhecidas e lista das não mapeadas (ficam só na descrição), sugestão informativa de condomínio. **Nada é salvo automaticamente.**
- **Salvar:** chama o `POST /imoveis` com as chaves nulas removidas; erros 409/422 mantêm os dados; sucesso leva a uma confirmação com link para o imóvel no painel (nasce "em análise").
- **Erros da interpretação em português por `code`:** texto sem dados de imóvel, interpretação indisponível, recurso não configurado (a tela desabilita o recurso e oferece o cadastro manual), limite de requisições com o tempo de espera, sem permissão.
- O formulário de cadastro ganha a capacidade de receber valores iniciais, destaques de campos e um destino de confirmação próprio, sem mudar o comportamento de `/anunciar`.

## Capabilities

### New Capabilities
- `listing-text-import`: fluxo da equipe para cadastrar um imóvel a partir de um texto colado — entrada, interpretação, revisão e salvamento.

### Modified Capabilities
- `mobile-access`: a nova tela entra na lista de páginas sem rolagem horizontal e seus botões principais na regra de 44px.

## Impact

- Nova rota `/admin/imoveis/importar`; novos componentes em `src/app/admin/imoveis/importar/`; novo hook sobre `POST /admin/imoveis/interpretar-texto`; `src/app/admin/_components/ImoveisAdminLista.tsx` (atalho); `src/app/anunciar/_components/ListPropertyForm.tsx` (valores iniciais, destaques, destino da confirmação).
- Tipos da API já regenerados (a produção já expõe a rota); o `endereco.ts` foi limpo para os tipos gerados (privacidade do endereço já está no ar).
- Fora de escopo (apontado pelo back-end): catálogo de amenidades por nome (não há `GET /amenidades`), fotos por interpretação (`foto_urls` nunca vem preenchido) e abrir o recurso a proprietários (hoje é só staff).
