import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FusionMethod,
  QuickSearchEvalResponse,
  QuickSearchResponse,
  SearchResultItem,
} from '../../core/models/quick-search.models';
import { QuickSearch as QuickSearchService } from '../../core/services/quick-search';
import { LiquidGlassDirective } from '../../shared/liquid-glass.directive';

type SortBy = 'fused' | 'bm25' | 'vector';

@Component({
  imports: [FormsModule, DecimalPipe, LiquidGlassDirective],
  selector: 'app-quick-search',
  styleUrl: './quick-search.scss',
  templateUrl: './quick-search.html',
})
export class QuickSearch {
  private readonly quickSearchService = inject(QuickSearchService);

  readonly query = signal('');
  readonly k = signal(5);
  readonly fusionMethod = signal<FusionMethod>('rrf');
  readonly bm25Weight = signal(0.5);
  readonly vectorWeight = signal(0.5);
  readonly useLlmRerank = signal(false);

  // Client-side re-order of the already-fused top-k the backend returned -
  // "above the sort": the search box/button sit above this control, which
  // sits above the results list it reorders.
  readonly sortBy = signal<SortBy>('fused');

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly response = signal<QuickSearchResponse | null>(null);

  readonly evalLoading = signal(false);
  readonly evalError = signal<string | null>(null);
  readonly evalResult = signal<QuickSearchEvalResponse | null>(null);

  readonly sortedResults = computed<SearchResultItem[]>(() => {
    const results = this.response()?.results ?? [];
    const sortBy = this.sortBy();
    if (sortBy === 'fused') return results;

    const scoreOf = (item: SearchResultItem) => (sortBy === 'bm25' ? item.bm25_score : item.vector_score);
    return [...results].sort((a, b) => (scoreOf(b) ?? -1) - (scoreOf(a) ?? -1));
  });

  search(): void {
    const trimmed = this.query().trim();
    if (!trimmed) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    this.response.set(null);

    this.quickSearchService
      .search({
        query: trimmed,
        k: this.k(),
        fusion_method: this.fusionMethod(),
        bm25_weight: this.bm25Weight(),
        vector_weight: this.vectorWeight(),
        use_llm_rerank: this.useLlmRerank(),
      })
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.response.set(res);
        },
        error: (err) => {
          this.loading.set(false);
          if (err.status === 503) {
            this.errorMessage.set(err.error?.detail ?? 'OpenSearch is not reachable.');
          } else {
            this.errorMessage.set('Something went wrong running the search. Please try again.');
          }
        },
      });
  }

  clear(): void {
    // Resets the query and its results/sort/error state - deliberately
    // leaves the tuning controls (k, fusion method, weights, rerank toggle)
    // as they are, since those are settings, not part of "this search".
    this.query.set('');
    this.response.set(null);
    this.errorMessage.set(null);
    this.sortBy.set('fused');
  }

  runEvaluation(): void {
    this.evalLoading.set(true);
    this.evalError.set(null);
    this.evalResult.set(null);

    this.quickSearchService.evaluate(this.k(), this.fusionMethod(), this.bm25Weight(), this.vectorWeight()).subscribe({
      next: (res) => {
        this.evalLoading.set(false);
        this.evalResult.set(res);
      },
      error: (err) => {
        this.evalLoading.set(false);
        this.evalError.set(err.error?.detail ?? 'Could not run the quality evaluation.');
      },
    });
  }
}
