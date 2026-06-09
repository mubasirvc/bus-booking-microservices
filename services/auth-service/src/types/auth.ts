export interface RegisterInput {
  email: string;
  password: string;
  userName: string;
  role: UserRole;
}

export type UserRole = "ADMIN" | "CUSTOMER" | "OPERATOR";

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  userName: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: UserData;
}
