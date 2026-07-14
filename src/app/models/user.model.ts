export type UserRole = 'admin' | 'member';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}
