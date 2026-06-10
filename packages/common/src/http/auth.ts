export interface AuthenticatedUser {
  id: string;
  email?: string;
  role: 'ADMIN' | 'CUSTOMER' | 'OPERATOR';
}

export const USER_ID_HEADER = 'x-user-id';
export const USER_EMAIL_HEADER = 'x-user-email';
export const USER_ROLE_HEADER = 'x-user-role';