export interface Usuario {
  id: number | string;
  nome: string;
  email: string;
  idade: number;
  role?: 'User' | 'Author' | 'Familiar';
  title?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
