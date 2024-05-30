# Messenger API

Aplicação de troca de mensagens. Este projeto tem a pretensão de imitar algumas
funcionalidades de aplicações de troca de messages.

## Funcionalidades Implementadas

- Criação de usuário
- Login
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
https://github.com/filipewelton/messenger-api.git
```

2. Instale as dependências:
```bash
npm install
```

3. Crie o arquivo de variáveis de ambiente na raiz do projeto, copie o conteúdo do
arquivo `.env.example` para este novo arquivo, preencha os valores das variáveis de
ambiente:
```bash
touch .env
cat .env.example > .env
```

4. Inicie os containers do docker:
```bash
docker compose up -d
```

5. Inicie o servidor:
```bash
npm run dev
```

6. Visualize as especificações da API no browser, pela rota
`http://localhost:{port}/docs/static/index.html`. O valor de `{port}` deve ser igual ao
que foi definido na variável de ambiente `PORT`.

## Tecnologias Utilizadas

- Framework: Fastify
- Banco de dados: Sqlite, Redis
- Corretor de mensagens: RabbitMQ
