## MODIFIED Requirements

### Requirement: Formulário coleta os dados essenciais do imóvel
O formulário SHALL coletar: endereço completo, características físicas (área útil, quartos, banheiros, vagas de garagem), título, descrição, tipo de operação (aluguel e/ou venda), os valores comerciais correspondentes ao tipo de operação escolhido e, opcionalmente, o tipo do imóvel (apartamento, casa, cobertura, studio, kitnet, terreno, comercial ou outro).

#### Scenario: Pelo menos um tipo de operação obrigatório
- **WHEN** um usuário tenta enviar o formulário sem marcar nem "disponível para aluguel" nem "disponível para venda"
- **THEN** o sistema impede o envio e indica que pelo menos um tipo de operação precisa ser escolhido

#### Scenario: Cadastro com tipo de imóvel especificado
- **WHEN** um usuário seleciona um tipo de imóvel e envia o formulário
- **THEN** esse tipo é enviado junto com o restante dos dados do imóvel

#### Scenario: Cadastro sem tipo de imóvel especificado
- **WHEN** um usuário envia o formulário sem selecionar um tipo de imóvel
- **THEN** o envio prossegue normalmente, sem exigir esse campo
