# GraphQL Angular Frontend

<p align="center">
  <img src="https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/GraphQL-Client-E10098?style=for-the-badge&logo=graphql&logoColor=white" alt="GraphQL" />
  <img src="https://img.shields.io/badge/Apollo-Angular-311C87?style=for-the-badge&logo=apollo-graphql&logoColor=white" alt="Apollo Angular" />
  <img src="https://img.shields.io/badge/Angular_Material-UI-757575?style=for-the-badge&logo=angular&logoColor=white" alt="Angular Material" />
  <img src="https://img.shields.io/badge/SCSS-Styling-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS" />
</p>

<p align="center">
  Frontend desenvolvido em <strong>Angular</strong> para integração com a API <strong>GraphQL Java + Spring Boot</strong>, com autenticação JWT, proteção de rotas e gerenciamento de usuários.
</p>

---

## Sobre o projeto

O **GraphQL Angular Frontend** é a interface cliente da aplicação backend construída em **Java + Spring Boot + GraphQL**.

Este projeto foi desenvolvido para consumir a API GraphQL, oferecendo uma experiência frontend moderna com:

- autenticação de usuários
- cadastro e login
- proteção de rotas
- gerenciamento de usuários
- integração com GraphQL via Apollo Angular
- interface organizada em páginas, serviços e componentes compartilhados

---

## Destaque para portfólio

Este projeto demonstra na prática:

- desenvolvimento frontend com **Angular 20**
- consumo de API **GraphQL**
- uso do **Apollo Angular**
- organização por páginas, serviços e módulos compartilhados
- autenticação com **JWT**
- proteção de rotas com **AuthGuard**
- integração real com backend Java/Spring
- interface preparada para evolução em aplicações corporativas

---

## Tecnologias utilizadas

- **Angular 20**
- **TypeScript**
- **Apollo Angular**
- **GraphQL**
- **Angular Material**
- **SCSS**
- **RxJS**
- **Angular SSR**
- **Express**

---

## Funcionalidades

### Autenticação
- login de usuário
- registro de nova conta
- armazenamento de token JWT no `localStorage`
- persistência de sessão local
- logout

### Usuários
- listagem de usuários
- criação de usuário
- atualização de usuário
- exclusão de usuário

### Navegação
- rota pública para login
- rota pública para cadastro
- rota protegida para dashboard de usuários
- redirecionamento automático para login quando não autenticado

### Interface
- estrutura com páginas e componentes separados
- uso de Angular Material
- sistema de toast/notificações
- diálogo de confirmação para ações críticas

---

## Integração com o backend

Este frontend foi construído para consumir a API GraphQL do projeto backend em Java/Spring Boot.

### Endpoint configurado

```ts
apiUrl: 'http://localhost:8180/graphql'
```

### Principais operações consumidas

- `login`
- `register`
- `todosUsuarios`
- `criarUsuario`
- `atualizarUsuario`
- `deletarUsuario`

---

## Estrutura do projeto

```bash
src
├── app
│   ├── components
│   │   └── pages
│   │       ├── auth
│   │       ├── dashboard
│   │       └── usuario
│   ├── graphql
│   │   └── auth.gql.ts
│   ├── models
│   ├── services
│   │   ├── auth
│   │   ├── error
│   │   └── user.service.ts
│   ├── shared
│   │   ├── toast
│   │   └── confirm-dialog.component.ts
│   ├── types
│   ├── app.component.ts
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.scss
├── assets
├── environments
├── styles
├── index.html
├── main.ts
├── main.server.ts
├── polyfills.ts
└── styles.scss
```

---

## Arquitetura do projeto

### `components/pages`
Contém as páginas principais da aplicação, incluindo autenticação, dashboard e fluxo de usuário.

### `graphql`
Centraliza as operações GraphQL utilizadas pelo frontend.

### `services`
Responsável pela comunicação com a API, autenticação, regras de acesso e tratamento de erro.

### `shared`
Componentes reutilizáveis da interface, como toast e diálogo de confirmação.

### `models` e `types`
Organização dos contratos e tipagens utilizados pela aplicação.

---

## Rotas da aplicação

```ts
/login
/register
/user
```

### Comportamento das rotas

- `/login` → acesso à autenticação
- `/register` → criação de nova conta
- `/user` → dashboard protegido por `AuthGuard`
- qualquer rota inválida redireciona para `/login`

---

## Autenticação

O projeto utiliza autenticação baseada em **JWT**.

### Fluxo implementado

1. o usuário realiza login ou cadastro
2. o frontend recebe o token JWT da API
3. o token é salvo no `localStorage`
4. o Apollo envia o token no header `Authorization`
5. as rotas protegidas validam se existe sessão local

### Chaves usadas no `localStorage`

```ts
access_token
current_user
```

---

## Configuração do Apollo Client

A aplicação utiliza o **Apollo Angular** com:

- `HttpLink` para comunicação com a API
- `InMemoryCache` para cache local
- `setContext` para envio automático do token JWT no header

Exemplo conceitual do fluxo:

```ts
Authorization: Bearer <token>
```

---

## Operações GraphQL utilizadas

### Login

```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      name
      email
    }
  }
}
```

### Registro

```graphql
mutation Register($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    token
    user {
      id
      name
      email
    }
  }
}
```

### Listar usuários

```graphql
query TodosUsuarios {
  todosUsuarios {
    id
    nome
    email
    idade
  }
}
```

### Criar usuário

```graphql
mutation CriarUsuario($nome: String!, $email: String!, $idade: Int!) {
  criarUsuario(nome: $nome, email: $email, idade: $idade) {
    id
    nome
    email
    idade
  }
}
```

### Atualizar usuário

```graphql
mutation AtualizarUsuario($id: ID!, $nome: String, $email: String, $idade: Int) {
  atualizarUsuario(id: $id, nome: $nome, email: $email, idade: $idade) {
    id
    nome
    email
    idade
  }
}
```

### Deletar usuário

```graphql
mutation DeletarUsuario($id: ID!) {
  deletarUsuario(id: $id)
}
```

---

## Como executar o projeto

### Pré-requisitos

Antes de iniciar, você precisa ter instalado:

- **Node.js**
- **npm**
- **Angular CLI**
- o backend **GraphQL Java API** em execução na porta `8180`

---

### 1. Clone o repositório

```bash
git clone https://github.com/Victor-Hugo-A/graphql_angular.git
```

### 2. Acesse a pasta do projeto

```bash
cd graphql_angular
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm start
```

ou

```bash
ng serve
```

### 5. Acesse no navegador

```bash
http://localhost:4200
```

---

## Configuração de ambiente

O endpoint da API está definido no arquivo de ambiente:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8180/graphql'
};
```

Se necessário, altere o endereço para o ambiente local ou produção.

---

## Build da aplicação

Para gerar a versão de produção:

```bash
npm run build
```

Os arquivos compilados serão gerados em:

```bash
dist/front_angular
```

---

## Suporte a SSR

O projeto possui configuração para **Angular SSR**, com dependências e scripts de servidor já presentes.

### Script disponível

```bash
npm run serve:ssr
```

---

## Diferenciais técnicos do projeto

- frontend desacoplado consumindo backend GraphQL
- autenticação real com JWT
- proteção de rota com guard
- centralização das operações GraphQL
- estrutura organizada para manutenção e evolução
- uso de Angular Material para interface
- base pronta para expansão com novos módulos

---

## Possíveis evoluções

- interceptors para controle mais avançado de sessão
- refresh token
- paginação e filtros na listagem de usuários
- tratamento global de erros GraphQL
- testes automatizados mais completos
- deploy em produção
- integração com ambiente cloud
- melhoria de responsividade e acessibilidade

---

## Aprendizados aplicados

Este projeto reforça conhecimentos em:

- Angular moderno
- TypeScript
- GraphQL no frontend
- Apollo Angular
- autenticação JWT
- integração frontend + backend
- organização de aplicações escaláveis
- consumo de API em contexto real

---

## Projeto relacionado

Backend consumido por esta aplicação:

- **GraphQL Java API** → backend em Java + Spring Boot + GraphQL

---

## Autor

<p align="left">
  <a href="https://github.com/Victor-Hugo-A">
    <img src="https://img.shields.io/badge/GitHub-Victor--Hugo--A-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Victor Hugo A" />
  </a>
  <a href="https://www.linkedin.com/in/victor-hugo-a57b021ab/">
    <img src="https://img.shields.io/badge/LinkedIn-Victor%20Hugo-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Victor Hugo" />
  </a>
</p>

---

## Status do projeto

🚧 Projeto em desenvolvimento, com foco em integração com backend Java/Spring e consolidação de práticas modernas de frontend com Angular + GraphQL.
