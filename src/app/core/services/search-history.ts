import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SearchHistoryResponse } from '../models/search-history.models';

@Service()
export class SearchHistory {
  private readonly http = inject(HttpClient);

  getHistory(): Observable<SearchHistoryResponse> {
    return this.http.get<SearchHistoryResponse>(`${environment.apiUrl}/api/search-history`);
  }
}
