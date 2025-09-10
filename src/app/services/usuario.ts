import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../assets/environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private executeQuery(query: string, variables?: any): Observable<any> {
    return this.http.post(this.apiUrl, {
      query,
      variables
    }).pipe(
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
}
