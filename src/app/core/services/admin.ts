import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserPublic } from '../models/auth.models';

@Service()
export class Admin {
  private readonly http = inject(HttpClient);

  // Every account except the owner's own - what the admin page renders.
  // Owner-only server-side (app.auth.deps.require_owner); this call 403s
  // for anyone else regardless of what the UI shows.
  getUsers(): Observable<UserPublic[]> {
    return this.http.get<UserPublic[]>(`${environment.apiUrl}/api/auth/users`);
  }

  approve(userId: number): Observable<UserPublic> {
    return this.http.post<UserPublic>(`${environment.apiUrl}/api/auth/approve/${userId}`, {});
  }

  revoke(userId: number): Observable<UserPublic> {
    return this.http.post<UserPublic>(`${environment.apiUrl}/api/auth/revoke/${userId}`, {});
  }
}
