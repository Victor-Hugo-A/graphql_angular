// src/app/services/user.service.ts
import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apollo = inject(Apollo);

  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
  public usuarios$ = this.usuariosSubject.asObservable();

  // ATUALIZADO para match com seu schema
  private GET_USUARIOS_QUERY = gql`
    query GetUsuarios {
      todosUsuarios {
        id
        nome
        email
        idade
      }
    }
  `;

  private CREATE_USUARIO_MUTATION = gql`
    mutation CreateUsuario($nome: String!, $email: String!, $idade: Int!) {
      criarUsuario(nome: $nome, email: $email, idade: $idade) {
        id
        nome
        email
        idade
      }
    }
  `;

  private UPDATE_USUARIO_MUTATION = gql`
    mutation UpdateUsuario($id: ID!, $nome: String, $email: String, $idade: Int) {
      atualizarUsuario(id: $id, nome: $nome, email: $email, idade: $idade) {
        id
        nome
        email
        idade
      }
    }
  `;

  private DELETE_USUARIO_MUTATION = gql`
    mutation DeleteUsuario($id: ID!) {
      deletarUsuario(id: $id)
    }
  `;

  refreshUsuarios(): void {
    this.apollo.watchQuery({
      query: this.GET_USUARIOS_QUERY,
      fetchPolicy: 'network-only'
    }).valueChanges
      .pipe(
        map((result: any) => result.data?.todosUsuarios || [])
      )
      .subscribe(usuarios => {
        this.usuariosSubject.next(usuarios);
      });
  }

  createUsuario(usuario: Usuario): Observable<any> {
    return this.apollo.mutate({
      mutation: this.CREATE_USUARIO_MUTATION,
      variables: {
        nome: usuario.nome,
        email: usuario.email,
        idade: usuario.idade
      }
    });
  }

  updateUsuario(id: number, usuario: Usuario): Observable<any> {
    return this.apollo.mutate({
      mutation: this.UPDATE_USUARIO_MUTATION,
      variables: {
        id: id.toString(), // Converte para string se seu ID é do tipo ID!
        nome: usuario.nome,
        email: usuario.email,
        idade: usuario.idade
      }
    });
  }

  deleteUsuario(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: this.DELETE_USUARIO_MUTATION,
      variables: {
        id: id.toString() // Converte para string se seu ID é do tipo ID!
      }
    });
  }

  extractDataOrThrow<T>(response: any, operation: string): T {
    if (response.errors?.length) {
      throw new Error(response.errors[0].message);
    }
    if (!response.data || !response.data[operation]) {
      throw new Error(`Operação ${operation} não retornou dados`);
    }
    return response.data[operation];
  }
}
