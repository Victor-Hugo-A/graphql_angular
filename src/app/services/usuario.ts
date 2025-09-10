// src/app/services/usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { environment } from '../../assets/environments/environment';
import { Usuario } from '../models/usuario.model';
import { GraphQLResponse } from '../types/graphql.types';
import { ErrorHandlerService } from './error/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
  ) { }

  private executeQuery(query: string, variables?: any): Observable<any> {
    console.log('Enviando para GraphQL:', { query, variables });

    return this.http.post<GraphQLResponse>(this.apiUrl, {
      query,
      variables
    }).pipe(
      tap((response: GraphQLResponse) => {
        if (response.errors) {
          // ✅ CORREÇÃO: Use response.errors instead of undefined variable 'error'
          response.errors.forEach(error => {
            this.errorHandler.logError(error, 'GraphQL Query');
          });
        }
      }),
      catchError(error => {
        console.error('Erro na requisição GraphQL:', error);
        return throwError(() => new Error('Erro ao conectar com o servidor'));
      })
    );
  }

  getUsuarios(): Observable<any> {
    const query = `
      query {
        todosUsuarios {
          id
          nome
          email
          idade
        }
      }
    `;
    return this.executeQuery(query);
  }

  getUsuario(id: number): Observable<any> {
    const query = `
      query UsuarioPorId($id: ID!) {
        usuarioPorId(id: $id) {
          id
          nome
          email
          idade
        }
      }
    `;
    return this.executeQuery(query, { id });
  }

  createUsuario(usuario: Omit<Usuario, 'id'>): Observable<any> {
    const query = `
      mutation CriarUsuario($nome: String!, $email: String!, $idade: Int!) {
        criarUsuario(nome: $nome, email: $email, idade: $idade) {
          id
          nome
          email
          idade
        }
      }
    `;
    return this.executeQuery(query, usuario);
  }

  updateUsuario(id: number, usuario: Partial<Usuario>): Observable<any> {
    const query = `
      mutation AtualizarUsuario($id: ID!, $nome: String, $email: String, $idade: Int) {
        atualizarUsuario(id: $id, nome: $nome, email: $email, idade: $idade) {
          id
          nome
          email
          idade
        }
      }
    `;
    return this.executeQuery(query, { id, ...usuario });
  }

  deleteUsuario(id: number): Observable<any> {
    const query = `
      mutation DeletarUsuario($id: ID!) {
        deletarUsuario(id: $id)
      }
    `;
    return this.executeQuery(query, { id });
  }

  // ✅ MÉTODO AUXILIAR PARA FACILITAR O USO NOS COMPONENTES
  extractDataOrThrow<T>(response: any, dataKey: string): T {
    if (response.errors && response.errors.length > 0) {
      const errorMessage = this.errorHandler.handleGraphQLErrors(response.errors);
      throw new Error(errorMessage);
    }

    if (!response.data || !response.data[dataKey]) {
      throw new Error('Resposta inválida do servidor');
    }

    return response.data[dataKey];
  }
}
