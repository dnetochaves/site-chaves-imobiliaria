## MODIFIED Requirements

### Requirement: Detalhe do imóvel no painel exibe dados e status sem ações de publicação
A tela de detalhe de um imóvel no painel SHALL exibir seus dados principais, o endereço completo (rua, número, complemento e CEP, quando informados) e o código interno (quando houver), o status atual em português, o seletor de corretor e um link para a página pública do imóvel, e SHALL oferecer um link para voltar à lista de imóveis do painel, onde as ações de publicação são executadas. Partes do endereço não informadas SHALL ser omitidas, sem exibir texto vazio. A tela de detalhe SHALL NOT oferecer as ações de aprovar, pausar, rejeitar ou republicar.

#### Scenario: Detalhe exibe dados e status
- **WHEN** um usuário staff abre o detalhe de um imóvel pelo ID
- **THEN** a tela exibe título, endereço e o status em português, independentemente do status do imóvel

#### Scenario: Detalhe sem ações de publicação
- **WHEN** um usuário staff abre o detalhe de um imóvel
- **THEN** a tela não oferece botões de aprovar, pausar, rejeitar ou republicar

#### Scenario: Voltar para a lista
- **WHEN** um usuário staff aciona o link para a lista de imóveis na tela de detalhe
- **THEN** o painel exibe a lista de imóveis

#### Scenario: Endereço completo e código interno para a equipe
- **WHEN** um usuário staff abre o detalhe de um imóvel que tem endereço e código interno informados
- **THEN** a tela exibe o endereço completo e o código interno

#### Scenario: Imóvel sem endereço informado
- **WHEN** um usuário staff abre o detalhe de um imóvel cadastrado sem rua e número
- **THEN** a tela exibe a localização (bairro e cidade), sem texto vazio no lugar do endereço
