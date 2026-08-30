import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProgressResponse, ProgressUpdateRequest } from '../models/progress.models';

@Service()
export class Progress {
  private readonly http = inject(HttpClient);

  getProgress(topic: string): Observable<ProgressResponse> {
    const params = new HttpParams().set('topic', topic);
    return this.http.get<ProgressResponse>(`${environment.apiUrl}/api/progress`, { params });
  }

  setProgress(payload: ProgressUpdateRequest): Observable<ProgressResponse> {
    return this.http.post<ProgressResponse>(`${environment.apiUrl}/api/progress`, payload);
  }
}
