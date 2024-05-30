# Messenger API

Este projeto tem a pretensão de imitar algumas funcionalidades de aplicações de troca de mensagens.

## Funcionalidades

✅ Criação de usuário<br>
✅ Login (apenas Github)<br>
✅ Exclusão de conta<br>
✅ Atualização de conta<br>
✅ Envio de convites de amizade<br>
✅ Aceitação ou rejeição de convites<br>
✅ Criação de grupos<br>
✅ Exclusão de grupos<br>
✅ Atualização de grupo<br>
✅ Adição de membros ao grupo<br>
✅ Remoção de membros do grupo<br>
✅ Transferência da administração do grupo<br>
✅ Saída do grupo<br>
❌ Envio e recebimento de mensagens

## Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/filipewelton/messenger-api.git
```

2. Instale as dependências:
```bash
npm install
```

3. Crie os arquivos de variáveis de ambiente na raiz do projeto, copie o conteúdo do
arquivo `.env.example` para estes novos arquivos, e preencha os valores das variáveis de
ambiente:
```bash
touch .env
touch .env.test
cat .env.example >> .env
cat .env.example >>  .env.test
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

## Observações

- As funcionalidades e regras de negócio estão detalhadas neste [arquivo](https://github.com/filipewelton/messenger-api/blob/main/docs/requirements.md);
- A ferramenta utilizada para criação de especificações de API foi o Swagger;
