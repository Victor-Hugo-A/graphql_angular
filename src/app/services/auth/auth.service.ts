// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { LOGIN, REGISTER } from '../../graphql/auth.gql';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthPayload {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apollo = inject(Apollo);

  // estado reativo opcional (útil pro dashboard/menus)
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.readUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  private readUserFromStorage(): AuthUser | null {
    try {
      const raw = localStorage.getItem('current_user');
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  private persistSession(payload: AuthPayload) {
    localStorage.setItem('access_token', payload.token);
    localStorage.setItem('current_user', JSON.stringify(payload.user));
    this.currentUserSubject.next(payload.user);
  }

  login(email: string, password: string): Observable<boolean> {
    return this.apollo.mutate<{ login: AuthPayload }>({
      mutation: LOGIN,
      variables: { email, password },
      fetchPolicy: 'no-cache',
    }).pipe(
      map((res) => {
        const payload = res.data?.login;
        if (!payload?.token) throw new Error('Token ausente na resposta de login.');
        this.persistSession(payload);
        return true;
      })
    );
  }

  register(name: string, email: string, password: string): Observable<boolean> {
    return this.apollo.mutate<{ register: AuthPayload }>({
      mutation: REGISTER,
      variables: { name, email, password },
      fetchPolicy: 'no-cache',
    }).pipe(
      map((res) => {
        const payload = res.data?.register;
        if (!payload?.token) throw new Error('Token ausente na resposta de registro.');
        this.persistSession(payload);
        return true;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }
}
