import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { QuickSearchEvalResponse, QuickSearchRequest, QuickSearchResponse } from '../models/quick-search.models';

@Service()
export class QuickSearch {
  private readonly http = inject(HttpClient);

  search(request: QuickSearchRequest): Observable<QuickSearchResponse> {
    return this.http.post<QuickSearchResponse>(`${environment.apiUrl}/api/quick-search`, request);
  }

  evaluate(k: number, fusionMethod: string, bm25Weight: number, vectorWeight: number): Observable<QuickSearchEvalResponse> {
    return this.http.get<QuickSearchEvalResponse>(`${environment.apiUrl}/api/quick-search/eval`, {
      params: { k, fusion_method: fusionMethod, bm25_weight: bm25Weight, vector_weight: vectorWeight },
    });
  }
}
