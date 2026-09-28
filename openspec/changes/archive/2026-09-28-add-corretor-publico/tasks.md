## 1. Utilitários compartilhados

- [x] 1.1 Mover `src/app/imoveis/[imovelId]/_components/ShareButton.tsx` para `src/components/ShareButton.tsx` (props genéricas: `title`), atualizar o import em `imoveis/[imovelId]/page.tsx`; verificar que a página de imóvel continua funcionando (`tsc` sem erro)
- [x] 1.2 `src/lib/whatsapp.ts`: acrescentar `buildWhatsappHrefForPhone(telefone, mensagem)`, reaproveitando a validação de telefone já usada por `buildLeadWhatsappHref`; verificar com alguns telefones válidos/inválidos (script ou teste manual)

## 2. Hook de leitura pública

- [x] 2.1 `src/lib/api/hooks/use-corretor-publico.ts`: `useCorretorPublico(slug)` sobre `GET /corretores/publico/{slug}`, com `CorretorNaoEncontradoError` para 404 (sem retry nesse caso), seguindo o padrão de `use-imovel-detail.ts`

## 3. Página pública do corretor

- [x] 3.1 `src/app/corretores/[slug]/page.tsx`: cabeçalho com foto, nome, CRECI (quando houver), cidade (quando houver), bio (quando houver) — cada campo ausente simplesmente omitido
- [x] 3.2 Ações de contato: botão de WhatsApp (usando `buildWhatsappHrefForPhone`, mensagem "Olá, {nome}. Acessei sua apresentação e gostaria de falar sobre um imóvel."), `tel:` quando houver telefone, `mailto:` quando houver e-mail, links para Instagram/LinkedIn quando presentes em `redes_sociais` — cada ação só aparece quando o dado existe
- [x] 3.3 Ação de compartilhar usando o `ShareButton` movido em 1.1
- [x] 3.4 Estados de carregando e de "corretor não encontrado" (slug inexistente ou corretor desativado — mesma mensagem para os dois, sem tentar diferenciar)
- [x] 3.5 Verificar no navegador: corretor com todos os campos, corretor com campos ausentes (nenhum aparece vazio/inventado), slug inexistente, compartilhar (com e sem Web Share API disponível, se der pra simular)

## 4. Link a partir da página do imóvel

- [x] 4.1 `PropertyPriceSidebar.tsx` (ou onde o design.md indicar): exibir "Corretor responsável: {nome}", link para `/corretores/{slug}`, só quando `imovel.corretor` existir
- [x] 4.2 Verificar no navegador: imóvel com corretor atribuído mostra o link; imóvel sem corretor não mostra nada a mais

## 5. Campos novos no formulário admin

- [x] 5.1 `CorretorFormulario.tsx`: acrescentar campos de bio (textarea), cidade (texto) e redes sociais (Instagram, LinkedIn), enviados em `POST`/`PATCH`
- [x] 5.2 Acrescentar o campo de slug, visível e editável só no modo edição (`corretor !== null`), com erro de campo dedicado no 409 (`describeCorretorError` ganha o caso de slug duplicado)
- [x] 5.3 `CorretorLinha.tsx`: link "Ver card público" (`/corretores/{slug}`, nova aba)
- [x] 5.4 Verificar no navegador: cadastrar um corretor com bio/cidade/redes, editar o slug de um corretor existente, slug duplicado mostrando erro no campo certo, link "Ver card público" abrindo a página pública correta

## 6. Fechamento

- [x] 6.1 Testar em 375px e 320px: página pública do corretor sem rolagem horizontal, ações de contato e compartilhar com 44px; conferir que o desktop não regrediu (página de imóvel e painel admin)
- [x] 6.2 Rodar `tsc --noEmit` e `eslint` no projeto inteiro sem erros
- [x] 6.3 Rodar `openspec validate add-corretor-publico --strict` sem erros
