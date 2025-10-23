// src/app/services/auth/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { gql } from 'apollo-angular';
import { Usuario } from '../../models/usuario.model';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apollo = inject(Apollo);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  // GraphQL Mutations
  private LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        id
        name
        email
        age
        role
        title
        createdAt
      }
    }
  `;

  private REGISTER_MUTATION = gql`
    mutation Register($input: UserInput!) {
      register(input: $input) {
        id
        name
        email
        age
        role
        title
        createdAt
      }
    }
  `;

  login(credentials: LoginRequest): Observable<any> {
    return this.apollo.mutate({
      mutation: this.LOGIN_MUTATION,
      variables: credentials
    }).pipe(
      tap((result: any) => {
        if (result.data?.login) {
          this.setCurrentUser(result.data.login);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.apollo.mutate({
      mutation: this.REGISTER_MUTATION,
      variables: { input: userData }
    }).pipe(
      tap((result: any) => {
        if (result.data?.register) {
          this.setCurrentUser(result.data.register);
        }
      })
    );
  }

  setCurrentUser(user: Usuario): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']).then(r => true);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}
