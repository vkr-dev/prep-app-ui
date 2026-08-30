import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GenerateResult, Question } from '../../core/models/generate.models';
import { Generate as GenerateService } from '../../core/services/generate';
import { Progress as ProgressService } from '../../core/services/progress';
import { LiquidGlassDirective } from '../../shared/liquid-glass.directive';

interface SubtopicGroup {
  subtopic: string;
  questions: Question[];
}

@Component({
  imports: [DecimalPipe, RouterLink, LiquidGlassDirective],
  selector: 'app-generate',
  styleUrl: './generate.scss',
  templateUrl: './generate.html',
})
export class Generate implements OnInit {
  private readonly generateService = inject(GenerateService);
  private readonly progressService = inject(ProgressService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly topic = signal('');
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly result = signal<GenerateResult | null>(null);

  readonly expandedSubtopics = signal<Set<string>>(new Set());
  readonly revealedAnswers = signal<Set<string>>(new Set());
  readonly progressMap = signal<Record<string, boolean>>({});

  // One-stop-shop view: grouped by subtopic (Question.category), in the
  // order subtopics first appear in the content - not by difficulty
  // anymore, so nothing about the topic gets fragmented/skipped across
  // separate difficulty buckets.
  readonly groups = computed<SubtopicGroup[]>(() => {
    const result = this.result();
    if (!result) return [];
    const order: string[] = [];
    const bySubtopic = new Map<string, Question[]>();
    for (const q of result.questions) {
      if (!bySubtopic.has(q.category)) {
        bySubtopic.set(q.category, []);
        order.push(q.category);
      }
      bySubtopic.get(q.category)!.push(q);
    }
    return order.map((subtopic) => ({ subtopic, questions: bySubtopic.get(subtopic)! }));
  });

  // Subtopic -> reading content lookup, so the template can render an
  // always-visible reading block above each subtopic's accordion. Empty
  // for LLM-generated results, which don't populate subtopic_content yet -
  // the template just skips rendering the block when there's no entry.
  readonly contentBySubtopic = computed<Record<string, string>>(() => {
    const entries = this.result()?.subtopic_content ?? [];
    const map: Record<string, string> = {};
    for (const entry of entries) {
      map[entry.subtopic] = entry.content;
    }
    return map;
  });

  readonly progressPercent = computed(() => {
    const groups = this.groups();
    if (groups.length === 0) return 0;
    const checkedCount = groups.filter((g) => this.progressMap()[g.subtopic]).length;
    return Math.round((checkedCount / groups.length) * 100);
  });

  readonly checkedCount = computed(() => this.groups().filter((g) => this.progressMap()[g.subtopic]).length);

  // [step name, latency ms][], in the order the pipeline actually ran them.
  readonly stepTimeline = computed(() => {
    const metrics = this.result()?.metrics;
    return metrics ? Object.entries(metrics.step_latencies_ms) : [];
  });

  ngOnInit(): void {
    const topic = this.route.snapshot.queryParamMap.get('topic')?.trim();
    if (!topic) {
      // No topic to run - this page only makes sense arrived at from search.
      this.router.navigate(['/']);
      return;
    }
    this.topic.set(topic);
    this.runSearch(topic);
  }

  isExpanded(subtopic: string): boolean {
    return this.expandedSubtopics().has(subtopic);
  }

  toggleAccordion(subtopic: string): void {
    const next = new Set(this.expandedSubtopics());
    if (next.has(subtopic)) {
      next.delete(subtopic);
    } else {
      next.add(subtopic);
    }
    this.expandedSubtopics.set(next);
  }

  answerKey(subtopic: string, question: string): string {
    return `${subtopic}::${question}`;
  }

  isRevealed(subtopic: string, question: string): boolean {
    return this.revealedAnswers().has(this.answerKey(subtopic, question));
  }

  toggleReveal(subtopic: string, question: string): void {
    const key = this.answerKey(subtopic, question);
    const next = new Set(this.revealedAnswers());
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this.revealedAnswers.set(next);
  }

  isSubtopicChecked(subtopic: string): boolean {
    return !!this.progressMap()[subtopic];
  }

  onProgressToggle(subtopic: string, checked: boolean): void {
    // Optimistic update - the progress bar should move immediately, not
    // wait on a round-trip.
    this.progressMap.update((m) => ({ ...m, [subtopic]: checked }));

    this.progressService.setProgress({ topic: this.topic(), subtopic, checked }).subscribe({
      next: (res) => this.progressMap.set(res.progress),
      error: () => {
        // Revert - the server didn't actually record it.
        this.progressMap.update((m) => ({ ...m, [subtopic]: !checked }));
      },
    });
  }

  private runSearch(topic: string): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.result.set(null);

    this.generateService.generate(topic).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.result.set(res);
        this.fetchProgress(topic);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 403) {
          this.errorMessage.set(
            'Your access is not approved or has expired. Ask the owner to approve/re-approve your account.',
          );
        } else if (err.status === 502) {
          this.errorMessage.set('The LLM provider call failed (bad/missing API key, rate limit, or outage).');
        } else {
          this.errorMessage.set('Something went wrong generating questions. Please try again.');
        }
      },
    });
  }

  private fetchProgress(topic: string): void {
    this.progressService.getProgress(topic).subscribe({
      next: (res) => this.progressMap.set(res.progress),
      error: () => {
        // Progress is a nice-to-have on top of the content itself - fail
        // quietly, everything just starts unchecked for this view.
      },
    });
  }
}
