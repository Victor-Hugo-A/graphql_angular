import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';
import { LOGIN, REGISTER } from '../../graphql/auth.gql';

// ✅ Exporte o tipo que o Dashboard importa
export interface AuthUser {
  id: string | number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apollo = inject(Apollo);
  private TOKEN_KEY = 'access_token';
  private USER_KEY  = 'current_user';

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // ✅ Getter usado no Dashboard
  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as AuthUser; } catch { return null; }
  }

  private setSession(token: string, user?: AuthUser) {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (user) localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  async login(email: string, password: string): Promise<boolean> {
    const res = await firstValueFrom(
      this.apollo.mutate<any>({
        mutation: LOGIN,
        variables: { email, password },
        fetchPolicy: 'no-cache',
        errorPolicy: 'none',
      })
    );
    const payload = res?.data?.login;
    const token = payload?.token;
    if (!token) throw new Error('Falha ao autenticar. Verifique as credenciais.');

    // payload.user deve ter { id, name, email } conforme schema
    this.setSession(token, payload?.user);
    return true;
  }

  async register(name: string, email: string, password: string): Promise<boolean> {
    const res = await firstValueFrom(
      this.apollo.mutate<any>({
        mutation: REGISTER,
        variables: { name, email, password },
        fetchPolicy: 'no-cache',
        errorPolicy: 'none',
      })
    );
    const payload = res?.data?.register;
    const token = payload?.token;
    if (!token) throw new Error('Erro ao criar a conta.');

    this.setSession(token, payload?.user);
    return true;
  }
}
