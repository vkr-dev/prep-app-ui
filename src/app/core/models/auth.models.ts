// Mirrors app/schemas/auth.py and app/models/user.py in prep-app-be.

export type UserStatus = 'owner' | 'pending' | 'approved' | 'revoked';

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  status: UserStatus;
  access_expires_at: string | null;
}

export interface UserPublic {
  id: number;
  email: string;
  status: UserStatus;
  access_expires_at: string | null;
}
