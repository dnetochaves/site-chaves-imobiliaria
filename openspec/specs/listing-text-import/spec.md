# listing-text-import Specification

## Purpose

Permite que a equipe cadastre um imóvel a partir de uma mensagem de anúncio colada (ex.: WhatsApp): o texto é interpretado em uma proposta de cadastro que a pessoa revisa e corrige no formulário antes de salvar, com avisos de conferência e sem gravar nada automaticamente.

## Requirements

### Requirement: Importação por texto é restrita à equipe
A tela de importar imóvel por texto (`/admin/imoveis/importar`) SHALL ser acessível apenas a usuários staff, com a mesma guarda do painel administrativo, e a lista de imóveis do painel SHALL oferecer um atalho "Cadastrar por texto" que leva a ela.

#### Scenario: Staff abre a tela pelo atalho
- **WHEN** um usuário staff aciona "Cadastrar por texto" na lista de imóveis do painel
- **THEN** o sistema exibe a tela de importar imóvel por texto

#### Scenario: Usuário sem permissão
- **WHEN** um usuário autenticado sem permissão de staff acessa `/admin/imoveis/importar`
- **THEN** o sistema exibe "Página não encontrada", sem qualquer conteúdo da tela

### Requirement: Entrada do texto do anúncio
A tela SHALL oferecer um campo de texto para colar a mensagem do anúncio, com contador de caracteres (limite de 6000) e o botão "Interpretar". O botão SHALL ficar indisponível quando o texto estiver vazio, acima do limite ou enquanto uma interpretação estiver em andamento. O texto SHALL ser enviado exatamente como foi colado. A tela SHALL avisar que o texto é enviado a um serviço de inteligência artificial de terceiros, que telefone, e-mail, CPF e CNPJ são mascarados antes do envio e que nomes de pessoas não são, recomendando não colar nomes de proprietários.

#### Scenario: Texto dentro do limite
- **WHEN** um usuário staff cola um texto de até 6000 caracteres
- **THEN** o contador mostra o total de caracteres e o botão "Interpretar" fica disponível

#### Scenario: Texto vazio
- **WHEN** o campo de texto está vazio (ou só com espaços)
- **THEN** o botão "Interpretar" fica indisponível

#### Scenario: Texto acima do limite
- **WHEN** o texto colado passa de 6000 caracteres
- **THEN** o contador indica o excesso e o botão "Interpretar" fica indisponível

#### Scenario: Aviso de privacidade
- **WHEN** a tela de entrada é exibida
- **THEN** o aviso sobre o envio a um serviço de IA e o mascaramento parcial de dados pessoais está visível

### Requirement: Interpretação em andamento
Enquanto o texto está sendo interpretado, a tela SHALL exibir um indicador de progresso e manter o botão "Interpretar" indisponível. A espera SHALL tolerar até 60 segundos, e o sistema SHALL NOT repetir a chamada automaticamente.

#### Scenario: Indicador de progresso
- **WHEN** um usuário staff aciona "Interpretar"
- **THEN** a tela exibe um indicador de progresso e o botão fica indisponível até a resposta chegar

#### Scenario: Interpretação demora demais
- **WHEN** a interpretação não responde em 60 segundos
- **THEN** o sistema informa que não foi possível interpretar agora e oferece o cadastro manual, sem tentar de novo sozinho

### Requirement: Revisão da proposta antes de salvar
Depois de interpretar, a tela SHALL exibir o formulário de cadastro de imóvel pré-preenchido com a proposta, para revisão e correção. Um valor não informado na proposta (`null`) SHALL aparecer como campo vazio. A tela SHALL exibir: os avisos devolvidos pela interpretação, com a mensagem em português e destaque maior para os de maior risco (total divergente, possível duplicado, código já cadastrado, endereço na descrição, valor sem lastro); os campos ausentes destacados como obrigatórios a preencher; os campos inválidos destacados com o valor mantido para correção; a quantidade de amenidades reconhecidas e a lista das não mapeadas (que ficam só na descrição); e, quando houver, o condomínio identificado ou os candidatos, apenas como informação. Um aviso de código desconhecido SHALL ser exibido normalmente com a sua mensagem. O sistema SHALL NOT salvar o imóvel automaticamente após interpretar.

#### Scenario: Formulário pré-preenchido
- **WHEN** a interpretação devolve uma proposta com título, bairro e valor de aluguel
- **THEN** o formulário de cadastro aparece com esses campos preenchidos e os demais vazios

#### Scenario: Avisos exibidos
- **WHEN** a interpretação devolve avisos
- **THEN** a tela exibe cada aviso com sua mensagem, destacando os de maior risco

#### Scenario: Aviso desconhecido
- **WHEN** a interpretação devolve um aviso com um código que a tela não conhece
- **THEN** o aviso é exibido com a sua mensagem, sem erro

#### Scenario: Campos ausentes destacados
- **WHEN** a interpretação lista um campo como ausente (ex.: área útil)
- **THEN** o campo correspondente aparece destacado como obrigatório a preencher

#### Scenario: Campos inválidos destacados
- **WHEN** a interpretação lista um campo como inválido (ex.: estado "Bahia")
- **THEN** o campo aparece destacado com o valor mantido, para o usuário corrigir

#### Scenario: Amenidades
- **WHEN** a interpretação reconhece amenidades e deixa outras sem correspondência
- **THEN** a tela informa quantas foram reconhecidas e lista as não mapeadas, indicando que elas ficaram apenas na descrição

#### Scenario: Condomínio sugerido
- **WHEN** a interpretação identifica um condomínio ou candidatos
- **THEN** a tela os exibe apenas como informação, sem vincular o imóvel a nenhum deles

#### Scenario: Nada é salvo sem revisão
- **WHEN** a interpretação termina
- **THEN** nenhum imóvel é cadastrado até o usuário staff acionar o cadastro no formulário

### Requirement: Salvar a proposta revisada
Ao confirmar o cadastro no formulário de revisão, o sistema SHALL enviar o imóvel omitindo os campos não preenchidos (nunca enviando valores nulos) e SHALL exibir uma confirmação com o link para o imóvel no painel, informando que o anúncio nasce em análise. Se o cadastro falhar, o sistema SHALL exibir a mensagem de erro em português e manter todos os dados do formulário, inclusive quando o código interno já estiver em uso ou a unidade já tiver outro anúncio ativo.

#### Scenario: Cadastro bem-sucedido
- **WHEN** o usuário staff revisa a proposta e confirma o cadastro
- **THEN** o sistema exibe a confirmação com o link para o imóvel no painel, informando que ele está em análise

#### Scenario: Campos vazios não são enviados
- **WHEN** o usuário confirma o cadastro com campos opcionais em branco
- **THEN** esses campos não são enviados, e o servidor aplica seus valores padrão

#### Scenario: Código interno já em uso
- **WHEN** a API recusa o cadastro porque o código interno pertence a outro anúncio ativo
- **THEN** o sistema informa que o código já está em uso e mantém os dados preenchidos

#### Scenario: Unidade já tem anúncio ativo
- **WHEN** a API recusa o cadastro porque a unidade já tem outro anúncio em análise ou publicado
- **THEN** o sistema informa isso e mantém os dados preenchidos

#### Scenario: Cadastrar outro imóvel
- **WHEN** a confirmação é exibida e o usuário staff aciona "Cadastrar outro por texto"
- **THEN** o sistema volta à tela de entrada, com o campo de texto vazio

### Requirement: Erros da interpretação são explicados em português
O sistema SHALL traduzir os erros da interpretação a partir do código do erro (nunca exibindo a mensagem em inglês da API) e SHALL sempre oferecer o cadastro manual como saída. Texto sem dados de imóvel SHALL informar que não foi encontrado um anúncio no texto. Interpretação indisponível SHALL informar que não foi possível interpretar agora. Recurso não configurado SHALL indisponibilizar a interpretação e informar que o recurso não está disponível no momento. Limite de requisições SHALL informar o tempo de espera quando disponível, sem nova tentativa automática. Texto vazio ou acima do limite recusado pelo servidor SHALL exibir a mensagem junto ao campo de texto. Sessão expirada SHALL levar ao login.

#### Scenario: Texto sem dados de imóvel
- **WHEN** a API informa que não encontrou dados de imóvel no texto
- **THEN** o sistema informa que não encontrou um anúncio nesse texto e oferece o cadastro manual

#### Scenario: Interpretação indisponível
- **WHEN** a API informa que a interpretação está indisponível
- **THEN** o sistema informa que não foi possível interpretar agora e oferece o cadastro manual

#### Scenario: Recurso não configurado
- **WHEN** a API informa que a interpretação não está configurada
- **THEN** o botão "Interpretar" fica indisponível, a tela informa que o recurso não está disponível no momento e oferece o cadastro manual

#### Scenario: Limite de requisições
- **WHEN** a API informa que o limite de requisições foi atingido
- **THEN** o sistema pede para aguardar, informando o tempo de espera quando disponível, sem repetir a chamada

#### Scenario: Texto recusado pelo servidor
- **WHEN** a API recusa o texto por vazio ou acima do limite
- **THEN** a mensagem aparece junto ao campo de texto

#### Scenario: Cadastro manual como saída
- **WHEN** qualquer erro de interpretação é exibido
- **THEN** a tela oferece um acesso ao formulário de cadastro manual
