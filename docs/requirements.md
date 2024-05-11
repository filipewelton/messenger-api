# Requisitos Funcionais

- [x] Deve ser possível criar se registrar;
- [x] Deve ser possível autenticar com conta social;
- [x] Deve ser possível identificar o usuário entre as requisições com um token de acesso;
- [x] Deve ser possível excluir a conta de usuário;
- [x] Deve ser possível atualizar a conta de usuário;
- [x] Deve ser possível adicionar outros usuário a lista de contatos por meio de convite;
- [x] Deve ser possível remover usuários da lista de contatos;
- [ ] Deve ser possível criar grupos;
- [ ] Deve ser possível excluir grupos;
- [ ] Deve ser possível atualizar as informações do grupo;
- [ ] Deve ser possível adicionar usuário a um grupo;
- [ ] Deve ser possível remover um usuário de um grupo;
- [ ] Deve ser possível transferir a administração de um grupo para outro usuário;
- [ ] Deve ser possível sair de um grupo;
- [ ] Deve ser possível enviar mensagens de texto;
- [ ] Deve ser possível enviar arquivos;
- [ ] Deve ser possível identificar o status de uma mensagem;

# Regras de Negócio

- [x] O tempo de expiração de um convite deve ser de 3 dias;
- [ ] O grupo deve ter apenas um administrador;
- [ ] O nome do grupo deve ter no máximo 50 caracteres;
- [ ] A descrição do grupo deve ter no máximo 120 caracteres;
- [ ] Apenas o administrador de um grupo pode excluir o grupo;
- [ ] Apenas o administrador pode atualizar as informações do grupo;
- [ ] Apenas o administrador pode adicionar usuários ao grupo;
- [ ] Apenas o administrador pode remover usuários do grupo;
- [ ] Deve ser possível sair de um grupo apenas quando não for o usuário não for
  administrador;
- [ ] As mensagens de texto devem ter no máximo 4096 caracteres;
- [ ] Tamanho de um arquivo deve ter no máximo 1GB;
- [ ] Apenas arquivos do tipo PNG, JPG, GIF, SVG, PDF, MP3, MP4 devem ser aceitos;
- [ ] As mensagens deve ter os seguintes status: envido, recebido, lido;

# Requisitos Não-funcionais

- [x] Dados de usuários, contatos, grupos e outros dados relacionados, devem ser
  armazenados no SQLite.
- [x] Os convites devem ser armazenados no Redis.
