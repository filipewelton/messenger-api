# Messenger API

Este projeto tem a pretensão de imitar algumas funcionalidades de aplicações de troca de messages.

## Funcionalidades Implementadas

- Criação de usuário
- Login (apenas Github)
- Exclusão de conta
- Atualização de conta
- Envio de convites de amizade
- Aceitação ou rejeição de convites
- Criação de grupos
- Exclusão de grupos
- Atualização de grupo
- Adição de membros ao grupo
- Remoção de membros do grupo
- Transferência da administração do grupo
- Saída do grupo

# Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/filipewelton/messenger-api.git
```

2. Instale as dependências:
```bash
npm install
```

3. Crie o arquivo de variáveis de ambiente na raiz do projeto, copie o conteúdo do
arquivo `.env.example` para este novo arquivo, e preencha os valores das variáveis de
ambiente:
```bash
touch .env
cat .env.example > .env
```

4. Inicie os containers do docker:
```bash
docker compose up -d
```

5. Execute as migrações:
```bash
npm run knex migrate:latest
```

6. Inicie o servidor:
```bash
npm run dev
```

7. Visualize as especificações da API no browser, pela rota
`http://localhost:{port}/docs/static/index.html`. O valor de `{port}` deve ser igual ao
que foi definido na variável de ambiente `PORT`.

## Tecnologias Utilizadas

- Framework: Fastify
- Banco de dados: Sqlite, Redis
- Corretor de mensagens: RabbitMQ

## Informações

- As funcionalidades e regras de negócio estão detalhas neste [arquivo](https://github.com/filipewelton/messenger-api/blob/main/docs/requirements.md);
- A ferramenta utilizada para especificação da API foi o Swagger;
