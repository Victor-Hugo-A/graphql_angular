// src/app/models/auth.model.ts
import {Usuario} from './usuario.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;    // Mantém em inglês no frontend
  email: string;
  password: string;
  age?: number;    // Mantém em inglês no frontend
}

export interface AuthResponse {
  user: Usuario;
  token?: string;
}
