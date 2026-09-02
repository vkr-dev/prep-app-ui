import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchHistoryGroup } from '../../core/models/search-history.models';
import { SearchHistory as SearchHistoryService } from '../../core/services/search-history';
import { QuickSearch as HybridSearchSection } from '../quick-search/quick-search';
import { LiquidGlassDirective } from '../../shared/liquid-glass.directive';

const MAX_TOPIC_WORDS = 50;

@Component({
  imports: [FormsModule, LiquidGlassDirective, HybridSearchSection],
  selector: 'app-search',
  styleUrl: './search.scss',
  templateUrl: './search.html',
})
export class Search implements OnInit {
  private readonly historyService = inject(SearchHistoryService);
  private readonly router = inject(Router);

  readonly topic = signal('');
  readonly loadingHistory = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly groups = signal<SearchHistoryGroup[]>([]);

  readonly wordCount = computed(() => {
    const trimmed = this.topic().trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  });

  readonly overWordLimit = computed(() => this.wordCount() > MAX_TOPIC_WORDS);
  readonly maxWords = MAX_TOPIC_WORDS;

  ngOnInit(): void {
    this.loadingHistory.set(true);
    this.historyService.getHistory().subscribe({
      next: (res) => {
        this.loadingHistory.set(false);
        this.groups.set(res.groups);
      },
      error: () => {
        this.loadingHistory.set(false);
        // Past searches are a nice-to-have, not critical - fail quietly and
        // just show an empty list rather than blocking the search bar.
      },
    });
  }

  submit(): void {
    const trimmed = this.topic().trim();
    if (!trimmed || this.overWordLimit()) return;
    this.goToGenerate(trimmed);
  }

  selectPastSearch(topic: string): void {
    this.goToGenerate(topic);
  }

  private goToGenerate(topic: string): void {
    this.router.navigate(['/generate'], { queryParams: { topic } });
  }
}
