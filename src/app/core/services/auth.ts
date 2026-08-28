import { Service, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, TokenResponse, UserPublic, UserStatus } from '../models/auth.models';

const TOKEN_KEY = 'prep_app_access_token';
const STATUS_KEY = 'prep_app_status';
const EXPIRES_KEY = 'prep_app_access_expires_at';

@Service()
export class Auth {
  // Seeded from localStorage so a page refresh doesn't drop the session.
  // This is a UI convenience only - the backend guard re-checks status and
  // expiry in the DB on every /api/* call, so a stale value here can never
  // grant access it doesn't allow.
  private readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly status = signal<UserStatus | null>(
    (localStorage.getItem(STATUS_KEY) as UserStatus | null) ?? null,
  );
  private readonly accessExpiresAt = signal<string | null>(localStorage.getItem(EXPIRES_KEY));

  readonly isLoggedIn = computed(() => this.token() !== null);
  readonly currentStatus = this.status.asReadonly();
  readonly currentAccessExpiresAt = this.accessExpiresAt.asReadonly();

  private readonly http = inject(HttpClient);

  getToken(): string | null {
    return this.token();
  }

  register(payload: RegisterRequest): Observable<UserPublic> {
    return this.http.post<UserPublic>(`${environment.apiUrl}/api/auth/register`, payload);
  }

  login(payload: LoginRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${environment.apiUrl}/api/auth/login`, payload)
      .pipe(tap((res) => this.setSession(res)));
  }

  logout(): void {
    this.token.set(null);
    this.status.set(null);
    this.accessExpiresAt.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STATUS_KEY);
    localStorage.removeItem(EXPIRES_KEY);
  }

  private setSession(res: TokenResponse): void {
    this.token.set(res.access_token);
    this.status.set(res.status);
    this.accessExpiresAt.set(res.access_expires_at);
    localStorage.setItem(TOKEN_KEY, res.access_token);
    if (res.status) {
      localStorage.setItem(STATUS_KEY, res.status);
    }
    if (res.access_expires_at) {
      localStorage.setItem(EXPIRES_KEY, res.access_expires_at);
    } else {
      localStorage.removeItem(EXPIRES_KEY);
    }
  }
}
