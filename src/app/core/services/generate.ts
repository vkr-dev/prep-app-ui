import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GeneratedQuestionSet } from '../models/generate.models';

@Service()
export class Generate {
  private readonly http = inject(HttpClient);

  generate(topic: string): Observable<GeneratedQuestionSet> {
    return this.http.post<GeneratedQuestionSet>(`${environment.apiUrl}/api/generate`, { topic });
  }
}
