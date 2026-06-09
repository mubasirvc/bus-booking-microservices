export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: 'ADMIN' | 'CUSTOMER' | 'OPERATOR';
}

export const USER_ID_HEADER = 'x-user-id';
