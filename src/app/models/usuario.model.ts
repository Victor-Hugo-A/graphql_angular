export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  password?: string;
  idade?: number;
  role?: 'User' | 'Author' | 'Familiar';
  title?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
