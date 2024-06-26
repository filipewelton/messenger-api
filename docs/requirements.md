# Requisitos Funcionais

- [x] Deve ser possível criar se registrar;
- [x] Deve ser possível autenticar com conta social;
- [x] Deve ser possível identificar o usuário entre as requisições com um token de acesso;
- [x] Deve ser possível excluir a conta de usuário;
- [x] Deve ser possível atualizar a conta de usuário;
- [x] Deve ser possível adicionar outros usuário a lista de contatos por meio de convite;
- [x] Deve ser possível remover usuários da lista de contatos;
- [x] Deve ser possível criar grupos;
- [x] Deve ser possível excluir grupos;
- [x] Deve ser possível atualizar as informações do grupo;
- [x] Deve ser possível adicionar usuário a um grupo;
- [x] Deve ser possível remover um usuário de um grupo;
- [x] Deve ser possível transferir a administração de um grupo para outro usuário;
- [x] Deve ser possível sair de um grupo;

# Regras de Negócio

- [x] O tempo de expiração de um convite deve ser de 3 dias;
- [x] O grupo deve ter apenas um administrador;
- [x] O nome do grupo deve ter no máximo 50 caracteres;
- [x] Apenas o administrador de um grupo pode excluir o grupo;
- [x] Apenas o administrador pode atualizar as informações do grupo;
- [x] Apenas o administrador pode adicionar usuários ao grupo;
- [x] Apenas o administrador pode remover usuários do grupo;
- [x] Deve ser possível sair de um grupo apenas quando o usuário não for o administrador
  do grupo;

# Requisitos Não-funcionais

- [x] Dados de usuários, contatos, grupos e outros dados relacionados, devem ser
  armazenados no SQLite.
- [x] Os convites devem ser armazenados no Redis.
