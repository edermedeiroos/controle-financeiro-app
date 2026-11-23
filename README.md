# Controle Financeiro App

Aplicação mobile de controle financeiro pessoal, desenvolvida como evolução do projeto web anterior. O sistema é composto por uma API REST em Java com Spring Boot e um aplicativo mobile em React Native com Expo.

## Estrutura do Projeto

```text
controle-financeiro-app/
├── backend/          # API REST (Java 17 + Spring Boot + JPA/Hibernate + MySQL)
├── frontend/         # App mobile (React Native + Expo + React Navigation + StyleSheet)
├── .gitignore
├── LICENSE
└── README.md
```

## Funcionalidades

- Resumo financeiro em tempo real com Total de Receitas, Total de Despesas e Saldo.
- Cadastro, listagem em `FlatList`, edição e exclusão lógica (soft delete) de transações.
- Campos obrigatórios (descrição, valor, data, tipo e categoria) e opcional (observação).
- Pesquisa de transações por descrição.
- Ordenação crescente e decrescente por data, valor ou descrição.
- Cadastro, listagem e exclusão de categorias (com bloqueio caso exista transação vinculada).
- Tratamento de erros de validação e registro não encontrado com mensagens no front-end.

## Pré-requisitos

- **JDK 17** ou superior
- **Apache Maven 3.8+**
- **MySQL 8.0+**
- **Node.js 18+** e **npm**
- **Expo Go** no celular ou emulador Android/iOS

## Configuração do Banco de Dados

Crie o banco de dados no MySQL:

```sql
CREATE DATABASE controle_financeiro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Caso necessário, ajuste usuário e senha em `backend/src/main/resources/application.properties` (padrão: `root` / `admin`).

## Como Executar o Back-end

```bash
cd backend
mvn spring-boot:run
```

A API será iniciada em `http://localhost:8080`. Na primeira execução com banco vazio, algumas categorias e transações iniciais são carregadas automaticamente.

## Como Executar o Front-end

```bash
cd frontend
npm install
npx expo start
```

### Configuração do endereço da API

Em `frontend/src/services/api.js`, ajuste a constante `BASE_URL` conforme o ambiente de teste:

- **Emulador Android:** `http://10.0.2.2:8080/api` (padrão configurado)
- **Simulador iOS / Web:** `http://localhost:8080/api`
- **Celular físico (Expo Go):** `http://<IP_DA_SUA_MAQUINA>:8080/api`

## Principais Endpoints da API

- `GET /api/transacoes` (parâmetros opcionais: `busca`, `campo`, `direcao`)
- `GET /api/transacoes/{id}`
- `GET /api/transacoes/resumo`
- `POST /api/transacoes`
- `PUT /api/transacoes/{id}`
- `DELETE /api/transacoes/{id}`
- `GET /api/categorias`
- `GET /api/categorias/{id}`
- `POST /api/categorias`
- `DELETE /api/categorias/{id}`
