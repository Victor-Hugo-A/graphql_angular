import { gql } from 'apollo-angular';

export const LOGIN = gql`
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
`;

export const REGISTER = gql`
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
`;
export const Q_TODOS = gql`
  query TodosUsuarios {
    todosUsuarios {
      id
      nome
      email
      idade
    }
  }
`;

export const M_CRIAR = gql`
  mutation CriarUsuario($nome: String!, $email: String!, $idade: Int!) {
    criarUsuario(nome: $nome, email: $email, idade: $idade) {
      id
      nome
      email
      idade
    }
  }
`;

export const M_ATUALIZAR = gql`
  mutation AtualizarUsuario($id: Long!, $nome: String, $email: String, $idade: Int) {
    atualizarUsuario(id: $id, nome: $nome, email: $email, idade: $idade) {
      id
      nome
      email
      idade
    }
  }
`;

export const M_DELETAR = gql`
  mutation DeletarUsuario($id: Long!) {
    deletarUsuario(id: $id)
  }
`;



