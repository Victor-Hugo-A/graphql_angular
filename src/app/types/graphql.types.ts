// src/app/types/graphql.types.ts
import { Usuario } from '../models/usuario.model';

export interface GraphQLResponse {
  data?: any;
  errors?: GraphQLError[];
}

export interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
}

export interface CreateUsuarioResponse {
  data?: {
    criarUsuario?: Usuario;
  };
  errors?: GraphQLError[];
}

export interface GetUsuariosResponse {
  data?: {
    todosUsuarios?: Usuario[];
  };
  errors?: GraphQLError[];
}

export interface UpdateUsuarioResponse {
  data?: {
    atualizarUsuario?: Usuario;
  };
  errors?: GraphQLError[];
}

export interface DeleteUsuarioResponse {
  data?: {
    deletarUsuario?: boolean;
  };
  errors?: GraphQLError[];
}

export interface GetUsuarioResponse {
  data?: {
    usuarioPorId?: Usuario;
  };
  errors?: GraphQLError[];
}
