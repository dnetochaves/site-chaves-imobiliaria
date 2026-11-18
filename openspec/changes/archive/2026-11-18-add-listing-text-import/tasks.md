## 1. Base: hook, erros e avisos

- [x] 1.1 `src/lib/api/hooks/use-interpretar-texto.ts`: mutação sobre `POST /admin/imoveis/interpretar-texto`, texto enviado sem alteração, timeout de 60 s (estouro vira erro local de "indisponível"), sem retry; `tsc` sem erro
- [x] 1.2 `src/lib/interpretacao-errors.ts`: mensagens em português por `error.code`/status (`texto_sem_dados_de_imovel`, `validation_error`, `interpretacao_indisponivel`, `interpretacao_nao_configurada`, 429 com `Retry-After`, 401/403) e a regra de severidade dos avisos (conjunto aberto); verificar com casos simulados
- [x] 1.3 Proxy de teste (scratchpad) simulando `/auth/me` (staff e comum), `POST /admin/imoveis/interpretar-texto` (exemplo do back-end, rascunho vazio de propósito, aviso desconhecido, campos ausentes/inválidos, e erros 422/503/503/429 acionados por palavras-chave no texto) e `POST /imoveis` (inclusive `409 codigo_ja_em_uso` e `unidade_ja_tem_anuncio_ativo`)

## 2. Formulário reaproveitável

- [x] 2.1 `ListPropertyForm`: props opcionais `valoresIniciais`, `destaques` (ausentes/inválidos → inputs e grupo de operação) e `hrefSucesso`/ação pós-sucesso; `amenidade_ids` preservado e reenviado; sem mudança de comportamento em `/anunciar`
- [x] 2.2 Verificar no navegador que `/anunciar` segue igual (cadastro simples, código só para staff, geocodificação opcional)

## 3. Tela de importação

- [x] 3.1 `src/app/admin/imoveis/importar/page.tsx` com a máquina de estados (entrada, interpretando, revisão, sucesso) e o componente de entrada: textarea, contador `n/6000`, botão "Interpretar" com as regras de habilitação, aviso de privacidade, indicador de progresso
- [x] 3.2 Revisão: painel de avisos (severidade por `codigo`, aviso desconhecido normal), contagem de amenidades reconhecidas e lista das não mapeadas, condomínio/candidatos como informação, formulário pré-preenchido com destaques; nada salvo automaticamente
- [x] 3.3 Erros da interpretação em português, desabilitação do botão em `interpretacao_nao_configurada`, "Cadastrar manualmente" em todo erro; confirmação com link para `/admin/imoveis/{id}` e "Cadastrar outro por texto"
- [x] 3.4 Atalho "Cadastrar por texto" no cabeçalho de `ImoveisAdminLista`

## 4. Verificação

- [x] 4.1 Verificar no navegador: staff abre pelo atalho; usuário comum recebe "Página não encontrada"; contador e habilitação do botão (vazio, só espaços, 6000, 6001); envio do texto idêntico ao colado
- [x] 4.2 Verificar no navegador a revisão: formulário pré-preenchido com o exemplo do back-end, `null` como vazio, avisos (altos, normais e desconhecido), ausentes e inválidos destacados, amenidades, condomínio, nenhum salvamento automático
- [x] 4.3 Verificar no navegador: salvar (payload sem chaves nulas), `codigo_ja_em_uso` e `unidade_ja_tem_anuncio_ativo` mantendo os dados, confirmação e "Cadastrar outro"
- [x] 4.4 Verificar no navegador cada erro da interpretação (texto sem dados, indisponível, não configurado, 429 com tempo, 422 no campo) e o timeout de 60 s, sempre com o acesso ao cadastro manual

## 5. Fechamento

- [x] 5.1 Testar em 375px e 320px (entrada, revisão e confirmação) sem rolagem horizontal, botões com 44px; conferir o desktop
- [x] 5.2 Restaurar `.env.local`, parar proxy e servidor; `tsc --noEmit` e `eslint` sem erros
- [x] 5.3 `openspec validate add-listing-text-import --strict` sem erros
